import React from "react";
import { Link } from "react-router-dom";
import goatImg from '../../img/goat.png'

export const Navbar = () => {
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
					<input type="text" placeholder="User" style={{ width: '100px', border: 'black solid 1px', padding:'5px' }} className="mx-1 rounded-pill px-2" />
					<input type="password" placeholder="PIN" style={{ width: '100px', border: 'black solid 1px', padding:'5px' }} className="mx-1 rounded-pill px-2" />
					<button style={{ width: '50px', border: 'black solid 1px' }} className="mx-1 rounded-pill px-2">→</button>
				</div>
			</nav>
		</div>
	);
};
