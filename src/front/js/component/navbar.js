import React from "react";
import { Link } from "react-router-dom";
import goatImg from '../../img/goat.png'

export const Navbar = () => {
	return (
		<div className="nav-bar">
			<nav className="navbar navbar-expand-lg bg-body-tertiary">
				<div>
					<a className="navbar-brand" href="#">Log in</a>
				</div>
				<div>
					<img src={goatImg} alt="logo" style={{width:'50px'}}/>
				</div>
				<div>
					<input type="text" placeholder="user" style={{ width: '100px', border: 'black solid 1px' }} className="mx-1 rounded-pill px-2" />
					<input type="password" placeholder="pin" style={{ width: '100px', border: 'black solid 1px' }} className="mx-1 rounded-pill px-2" />
					<button style={{ width: '50px', border: 'black solid 1px' }} className="mx-1 rounded-pill px-2">go</button>
				</div>
			</nav>
		</div>
	);
};
