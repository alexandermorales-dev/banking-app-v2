import React, { useContext } from "react";
import { useRef } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import bank from '../../img/bank-logo.png'

export const Navbar = () => {
	const { actions, store } = useContext(Context)
	const navigate = useNavigate()
	const emailRef = useRef(null)
	const passwordRef = useRef(null)

	const handleLogin = async () => {
		const email = emailRef.current.value
		const pass = passwordRef.current.value

		const res = await actions.handleLogin({ email: email, password: pass })
		if (!res.token) {
			const errorMsg = await res
			alert(errorMsg)
			navigate('/')
			return
		}
		navigate('/dashboard')
	}
	return (
    <div className="nav-bar">
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="col-4 d-none d-lg-block">
                <a className="navbar-brand" href="#">The Banking App</a>
            </div>

            <div className="col-2 col-md-4 col-lg-4 text-start order-0">
                <a href="/"> <img src={bank} alt="logo" style={{ width: '50px' }} /></a>
            </div>

            <div className="d-flex col-10 col-md-8 col-lg-4 justify-content-end order-1">
                <input ref={emailRef} type="text" placeholder="User" style={{ width: '100px' }} className="mx-1 rounded-pill px-2 form-control p-2" />
                <input ref={passwordRef} type="password" placeholder="PIN" style={{ width: '100px' }} className="mx-1 rounded-pill px-2 form-control p-2" />
                <button onClick={handleLogin} className="btn btn-light border rounded-pill px-4 py-2 fw-semibold shadow-sm">→</button>
            </div>
        </nav>
    </div>
);
};
