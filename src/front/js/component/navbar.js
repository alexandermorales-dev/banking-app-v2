import React, { useContext } from "react";
import { useRef } from "react";
import goatImg from '../../img/goat.png'
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
	const { actions, store } = useContext(Context)
	const navigate = useNavigate()
	const emailRef = useRef(null)
	const passwordRef = useRef(null)

	const handleLogin = async () => {
		const email = emailRef.current.value
		const pass = passwordRef.current.value

		const res = await actions.handleLogin({ email: email, password: pass })
		if (!res) return
		alert(res)
		navigate('/dashboard')
	}
	return (
		<div className="nav-bar">
			<nav className="navbar navbar-expand-lg bg-body-tertiary">
				<div className="col-4">
					<a className="navbar-brand" href="#">Log in</a>
				</div>
				<div className="col-4 text-center">
					<img src={goatImg} alt="logo" style={{ width: '50px' }} />
				</div>
				<div className="d-flex col-4 justify-content-end">
					<input ref={emailRef} type="text" placeholder="User" style={{ width: '100px' }} className="mx-1 rounded-pill px-2 form-control p-2" />
					<input ref={passwordRef} type="password" placeholder="PIN" style={{ width: '100px' }} className="mx-1 rounded-pill px-2 form-control p-2" />
					<button onClick={handleLogin} className="btn btn-light border rounded-pill px-4 py-2 fw-semibold shadow-sm">→</button>
				</div>
			</nav>
		</div>
	);
};
