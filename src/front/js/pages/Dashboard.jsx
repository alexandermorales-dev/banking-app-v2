import React, { useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import bank from '../../img/bank-logo.png'

const Dashboard = () => {
    const navigate = useNavigate()
    const depositRef = useRef(null)
    const withdrawRef = useRef(null)
    const { actions, store } = useContext(Context)
    const token = localStorage.getItem('token')
    const currentUserJson = localStorage.getItem('user')
    const currentUserObj = JSON.parse(currentUserJson)

    const handleTransaction = (e) => {
        if (e.target.name === 'deposit' && depositRef.current.value) {
            actions.handleTransaction({ type: 'deposit', amount: depositRef.current.value, userId: currentUserObj.id })

        } else if (e.target.name === 'withdraw' && withdrawRef.current.value) {
            actions.handleTransaction({ type: 'withdraw', amount: withdrawRef.current.value, userId: currentUserObj.id })
        }
    }
    const handleLogout = () => {
        actions.handleLogout()
        navigate('/')
    }

    useEffect(() => {

        const handleDashboard = async () => {
            const success = await actions.handleDashboard(token)
            if (!success) {
                alert('Please log in')
                navigate('/')
                return
            }

        }

        handleDashboard()


    }, [])

    return (token ?
        <div className="bg-light min-vh-100 d-flex flex-column text-dark">
            {/* TOP NAVIGATION */}
            <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm py-3 mb-4">
                <div className="container d-flex justify-content-between align-items-center">
                    <p className="welcome mb-0 text-muted d-none d-md-block">Welcome {currentUserObj.name}</p> {/* Hide on small screens */}
                    <img src={bank} alt="Logo" className="img-fluid" style={{ maxHeight: '45px' }} />


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
                                As of <span className="date">05/03/2037</span>
                            </p>
                        </div>
                        <p className="balance__value display-4 fw-bold mb-0">0000€</p>
                    </div>
                </div>

                {/* MOVEMENTS */}
                <div className="movements card shadow-sm mb-4 rounded-3">

                    <div className="card-body p-0">
                        {/* Movement Row 1 */}
                        <div className="movements__row d-flex justify-content-between align-items-center p-3 border-bottom">
                            <div className="movements__type movements__type--deposit badge bg-success text-uppercase py-2 px-3 rounded-pill fs-7">Deposit</div>
                            <div className="movements__date text-muted fs-7">3 days ago</div>
                            <div className="movements__value fw-bold text-success fs-5">4 000€</div>
                        </div>
                        {/* Movement Row 2 */}
                        <div className="movements__row d-flex justify-content-between align-items-center p-3">
                            <div className="movements__type movements__type--withdrawal badge bg-danger text-uppercase py-2 px-3 rounded-pill fs-7">Withdrawal</div>
                            <div className="movements__date text-muted fs-7">24/01/2037</div>
                            <div className="movements__value fw-bold text-danger fs-5">-378€</div>
                        </div>
                    </div>
                </div>

                <div className="row g-4 mb-4">
                    {/* ACTIONS */}

                    <div className="card-group">
                        <div className="card">
                            <div className="row row-cols-1 row-cols-md-3 g-4">
                                <div className="col">
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
                                </div>
                                <div className="col">
                                    <div className="card h-100 d-flex flex-column">
                                        <div className="card-body d-flex flex-column">
                                            <h5 className="card-title">Deposit</h5>
                                            <div className="flex-grow-1 d-flex align-items-center">
                                                <input className="form-control rounded-pill px-3 py-2" type="number" ref={depositRef} />
                                            </div>
                                            <button onClick={handleTransaction} type="button" name="deposit" className="btn btn-success mx-2">Deposit</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="card h-100 d-flex flex-column">
                                        <div className="card-body d-flex flex-column">
                                            <h5 className="card-title">Withdraw</h5>
                                            <div className="flex-grow-1 d-flex align-items-center">
                                                <input className="form-control rounded-pill px-3 py-2" type="number" ref={withdrawRef} />
                                            </div>
                                            <button onClick={handleTransaction} type="button" name="withdraw" className="btn btn-danger mx-2">Withdraw</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* SUMMARY */}
                    <div className="col-lg-6">
                        <div className="summary card shadow-sm rounded-3 p-4 h-100">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <p className="summary__label mb-0 fw-semibold">In</p>
                                <p className="summary__value summary__value--in text-success fw-bold fs-5 mb-0">0000€</p>
                            </div>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <p className="summary__label mb-0 fw-semibold">Out</p>
                                <p className="summary__value summary__value--out text-danger fw-bold fs-5 mb-0">0000€</p>
                            </div>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <p className="summary__label mb-0 fw-semibold">Interest</p>
                                <p className="summary__value summary__value--interest text-info fw-bold fs-5 mb-0">0000€</p>
                            </div>
                            <div className="mt-auto pt-3 border-top">
                                <button className="btn btn-outline-secondary btn-sm rounded-pill fw-semibold">&downarrow; SORT</button>
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
                            <h2 className="card-title h5 mb-3">Request loan</h2>
                            <form className="form form--loan row g-2 align-items-end">
                                <div className="col-10">
                                    <input type="number" className="form-control rounded-pill px-3 py-2 form__input--loan-amount" placeholder="Amount" />
                                    <label className="form__label form__label--loan d-block text-muted mt-1 fs-7">Amount</label>
                                </div>
                                <div className="col-2">
                                    <button className="btn btn-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '38px', height: '38px' }}>&rarr;</button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="col-lg-6">
                        {/* OPERATION: CLOSE */}
                        <div className="operation operation--close card shadow-sm rounded-3 p-4 h-100">
                            <h2 className="card-title h5 mb-3">Close account</h2>
                            <form className="form form--close row g-2 align-items-end">
                                <div className="col-4">
                                    <input type="text" className="form-control rounded-pill px-3 py-2 form__input--user" placeholder="Confirm User" />
                                    <label className="form__label d-block text-muted mt-1 fs-7">Confirm user</label>
                                </div>
                                <div className="col-4">
                                    <input
                                        type="password"
                                        maxLength="6"
                                        className="form-control rounded-pill px-3 py-2 form__input--pin"
                                        placeholder="Confirm PIN"
                                    />
                                    <label className="form__label d-block text-muted mt-1 fs-7">Confirm PIN</label>
                                </div>
                                <div className="col-2">
                                    <button className="btn btn-danger rounded-circle d-flex align-items-center justify-content-center" style={{ width: '38px', height: '38px' }}>&rarr;</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* LOGOUT TIMER */}
                <p className="logout-timer text-center text-muted mt-5">
                    You will be logged out in <span className="timer fw-bold text-dark">05:00</span>
                </p>
            </main>
        </div> : <div>
            <h1> Unauthorized</h1>

        </div>
    );
}
export default Dashboard    