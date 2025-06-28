import React, { useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import bank from '../../img/bank-logo.png'

const Dashboard = () => {
    const { actions, store } = useContext(Context)
    const [hasAccess, setHasAccess] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [currentDate, setCurrentDate] = useState('')

    const navigate = useNavigate()

    const depositRef = useRef(null)
    const withdrawRef = useRef(null)
    const loanRef = useRef(null)

    const token = localStorage.getItem('token')
    const currentUserJson = localStorage.getItem('user')
    const currentUserObj = JSON.parse(currentUserJson)

    const balance = Number(store.balance)
    const allTransactions = store.allTransactions || []
    const accountNumber = store.accountNumber




    const balanceFormatted = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(store.balance)
    const deposits = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(store.totalDeposits);
    const withdrawals = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(store.totalWithdrawals)

    const interests = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(Number(store.totalDeposits * 0.03))

    const handleTransaction = async (e) => {
        if (e.target.name === 'deposit' && depositRef.current.value) {
            if (depositRef.current.value <= 0) {
                alert('Amount should be a positive number')
                depositRef.current.value = ''
                return
            }
            const res = await actions.handleTransaction({ type: 'deposit', amount: depositRef.current.value, userId: currentUserObj.id })
            depositRef.current.value = ''
            const data = await res
            return data

        } else if (e.target.name === 'withdraw' && withdrawRef.current.value) {
            if (Number(withdrawRef.current.value) >= balance) {

                alert('Amount should be less than current balance')
                withdrawRef.current.value = ''
                return
            }
            const res = await actions.handleTransaction({ type: 'withdraw', amount: withdrawRef.current.value, userId: currentUserObj.id })
            withdrawRef.current.value = ''
            const data = await res
            return data

        }
    }
    const handleLogout = () => {
        actions.handleLogout()
        navigate('/')
    }

    const handleLoan = (e) => {
        e.preventDefault()
        if (Number(loanRef.current.value) > 0 && Number(loanRef.current.value) < (balance * 0.10)) {
            console.log('loan is on its way')
            setTimeout(() => {
                actions.handleTransaction({ type: 'deposit', amount: loanRef.current.value, userId: currentUserObj.id })
                loanRef.current.value = ''
            }, 3000);
        }
    }

    const handleCloseAccount = async (id) => {
        try {
            const message = await actions.handleDelete(id);
            alert(message);

            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/');
        } catch (error) {
            console.error("Error closing account:", error);
            alert(error.message);
        }
    };


    useEffect(() => {
        setIsLoading(true)

        const handleDashboard = async () => {
            const success = await actions.handleDashboard(token)
            if (!success || !token) {
                setHasAccess(false)
                alert('Please log in')
                navigate('/')
                setIsLoading(false)
                return
            }
            setHasAccess(true)
            setIsLoading(false)
            const today = new Date();
            const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
            const formattedDate = new Intl.DateTimeFormat('en-US', options).format(today);
            setCurrentDate(formattedDate);

            setTimeout(() => {
                alert('session expired')
                navigate('/')
                actions.handleLogout()

            }, 300000);

        }

        handleDashboard()


    }, [])

    if (isLoading) {
        return <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    }

    if (!hasAccess) {
        return <div>
            <h1>Unauthorized</h1>
        </div>
    }

    return (

        <div className="bg-light min-vh-100 d-flex flex-column text-dark">
            {/* TOP NAVIGATION */}
            <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm py-3 mb-4">
                <div className="container d-flex justify-content-between align-items-center">
                    <p className="welcome mb-0 text-muted d-none d-md-block">Welcome {currentUserObj.name}</p> {/* Hide on small screens */}
                    <a href="/"> <img src={bank} alt="Logo" className="img-fluid" style={{ maxHeight: '45px' }} /></a>


                    <button onClick={handleLogout} className="btn btn-danger border rounded-pill px-4 py-2 fw-semibold shadow-sm"> &larr;</button>
                </div>
            </nav>

            <main className="app container flex-grow-1 py-4">

                {/* BALANCE */}
                <div className="balance card shadow-sm mb-4 rounded-3 p-4 bg-primary text-white">
                    <div className="d-flex justify-content-between align-items-end">
                        <div>
                            <p className="balance__label fs-6 mb-1 opacity-75">Current balance</p>
                            <p className="balance__date fs-7 opacity-75">
                                As of <span className="date">{currentDate}</span>
                            </p>
                            <p>Account number: {accountNumber}</p>
                        </div>
                        <p className="balance__value display-4 fw-bold mb-0">{balanceFormatted} USD</p>
                    </div>
                </div>

                {/* MOVEMENTS */}
                <div className="movements card shadow-sm mb-4 rounded-3">
                    {allTransactions.slice(-5).sort((a, b) => {
                        const dateA = new Date(a.transaction_date);
                        const dateB = new Date(b.transaction_date);
                        return dateB - dateA;
                    }).map((transaction) => {
                        {/* Movement Row 1 */ }
                        return <div key={transaction.id} className="movements__row d-flex justify-content-between align-items-center p-3 border-bottom">
                            <div className={`movements__type movements__type--${transaction.type} badge bg-${transaction.type == 'deposit' ? 'success' : 'danger'} text-uppercase py-2 px-3 rounded-pill fs-7`}>{transaction.type}</div>
                            <div className="movements__date text-muted fs-7">{new Date(transaction.transaction_date).toLocaleString()}

                            </div>
                            <div className="movements__value fw-bold text-success fs-5">{new Intl.NumberFormat('en-US', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            }).format(Number(transaction.amount).toFixed(2))} USD</div>
                        </div>
                    })}
                </div>


                <div className="row g-4 mb-4">
                    {/* ACTIONS */}

                    {/* <div className="card-group">
                        <div className="card">
                            <div className="row row-cols-1 row-cols-md-3 g-4"> */}
                    {/* <div className="col">
                                    <div className="card h-100 d-flex flex-column">
                                        <div className="card-body d-flex flex-column">
                                            <h5 className="card-title">Open account</h5>
                                            <div className="py-4">
                                                <div className="form-check form-check-inline">
                                                    <input className="form-check-input" type="radio" name="exampleRadios" id="exampleRadios1" value="option1" />
                                                    <label className="form-check-label" htmlFor="exampleRadios1">
                                                        USD
                                                    </label>
                                                </div>
                                                <div className="form-check form-check-inline">
                                                    <input className="form-check-input" type="radio" name="exampleRadios" id="exampleRadios2" value="option2" />
                                                    <label className="form-check-label" htmlFor="exampleRadios2">
                                                        EUR
                                                    </label>
                                                </div>
                                                <div className="form-check form-check-inline">
                                                    <input className="form-check-input" type="radio" name="exampleRadios" id="exampleRadios3" value="option3" />
                                                    <label className="form-check-label" htmlFor="exampleRadios3">
                                                        VES
                                                    </label>
                                                </div>
                                            </div>
                                            <button type="button" className="btn btn-primary mx-2">Open Account</button>
                                        </div>
                                    </div>
                                </div> */}
                    <div className="col-6">
                        <div className="card h-100 d-flex flex-column">
                            <div className="card-body d-flex flex-column">
                                <h5 className="card-title">Deposit</h5>
                                <div className="flex-grow-1 d-flex align-items-center">
                                    <input className="form-control rounded-pill px-3 py-2" type="number" ref={depositRef} />
                                </div>
                                <button onClick={handleTransaction} type="button" name="deposit" className="btn btn-success m-2">Deposit</button>
                            </div>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="card h-100 d-flex flex-column">
                            <div className="card-body d-flex flex-column">
                                <h5 className="card-title">Withdraw</h5>
                                <div className="flex-grow-1 d-flex align-items-center">
                                    <input className="form-control rounded-pill px-3 py-2" type="number" ref={withdrawRef} />
                                </div>
                                <button onClick={handleTransaction} type="button" name="withdraw" className="btn btn-danger m-2">Withdraw</button>
                            </div>
                        </div>
                    </div>
                    {/* </div>
                        </div>
                    </div> */}
                    {/* SUMMARY */}
                    <div className="col-lg-6">
                        <div className="summary card shadow-sm rounded-3 p-4 h-100">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <p className="summary__label mb-0 fw-semibold">In</p>
                                <p className="summary__value summary__value--in text-success fw-bold fs-5 mb-0">{deposits} USD</p>
                            </div>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <p className="summary__label mb-0 fw-semibold">Out</p>
                                <p className="summary__value summary__value--out text-danger fw-bold fs-5 mb-0">{withdrawals} USD</p>
                            </div>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <p className="summary__label mb-0 fw-semibold">Interest</p>
                                <p className="summary__value summary__value--interest text-info fw-bold fs-5 mb-0">{interests} USD</p>
                            </div>

                        </div>
                    </div>

                    <div className="col-lg-6">
                        {/* OPERATION: TRANSFERS */}
                        <div className="operation operation--transfer card shadow-sm rounded-3 p-4 mb-4 h-100">
                            <h2 className="card-title h5 mb-3">Transfer money</h2>
                            <form className="form form--transfer row g-2 align-items-end">
                                <div className="col-6">
                                    <input type="text" className="form-control rounded-pill px-3 py-2 form__input--to" placeholder="Recipient" />
                                    <label className="form-label d-block text-muted mt-1 fs-7">Transfer to</label>
                                </div>
                                <div className="col-4">
                                    <input type="number" className="form-control rounded-pill px-3 py-2 form__input--amount" placeholder="Amount" />
                                    <label className="form-label d-block text-muted mt-1 fs-7">Amount</label>
                                </div>
                                <div className="col-2">
                                    <button className="btn btn-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '38px', height: '38px' }}>&rarr;</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="row g-4 mb-4">
                    <div className="col-lg-6">
                        {/* OPERATION: LOAN */}
                        <div className="operation operation--loan card shadow-sm rounded-3 p-4 h-100">
                            <h2 className="card-title h5 mb-3">Request loan <span className="fs-6"> (amount should be less than 10% of current Balance)</span> </h2>
                            <form className="form form--loan row g-2 align-items-end">
                                <div className="col-10">
                                    <input type="number" ref={loanRef} className="form-control rounded-pill px-3 py-2 form__input--loan-amount" placeholder="Amount" />
                                    <label className="form__label form__label--loan d-block text-muted mt-1 fs-7">Amount</label>
                                </div>
                                <div className="col-2">
                                    <button onClick={handleLoan} className="btn btn-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '38px', height: '38px' }}>&rarr;</button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="col-lg-6">
                        {/* OPERATION: CLOSE */}
                        <div className="d-flex align-items-center operation operation--close card shadow-sm rounded-3 p-4 h-100">
                            <h2 className="card-title h5 mb-3">Close account</h2>
                            <button
                                type="button"
                                onClick={() => handleCloseAccount(currentUserObj.id)}
                                className="btn btn-danger w-100"
                            >
                                Close Account
                            </button>
                        </div>
                    </div>
                </div>

                {/* LOGOUT TIMER */}
                <p className="logout-timer text-center text-muted mt-5">
                    You will be logged out in <span className="timer fw-bold text-dark">05:00</span>
                </p>
            </main>
        </div>
    );
}
export default Dashboard    