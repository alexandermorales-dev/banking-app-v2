import React from "react";
import { useState } from "react";
import { useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../component/navbar";

const Signup = () => {
    const { actions, store } = useContext(Context)
    const [formData, setFormData] = useState({ name: '', email: '', password: '' })
    const navigate = useNavigate()

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }))
    }

    const handleCreateAccount = async (e) => {
        e.preventDefault()
        const res = await actions.createAccount(formData)
        alert(res)
        setFormData({ name: '', email: '', password: '', is_admin: false });



    }
    return <div>
        <Navbar />


        <div className="container-fluid d-flex justify-content-center align-items-center min-vh-100">
            <form className="col-6 card h-100 border-0 shadow rounded-4 p-4 text-center">

                <div className="mb-3 row">
                    <label htmlFor="name" className="col-form-label text-start">Name</label>
                    <div>
                        <input onChange={handleChange} type="text" className="form-control" name='name' id="name" value={formData.name} />
                    </div>
                </div>
                <div className="mb-3 row">
                    <label htmlFor="email" className="col-form-label text-start">Email</label>
                    <div>
                        <input onChange={handleChange} type="text" className="form-control" name='email' id="email" value={formData.email} />
                    </div>
                </div>
                <div className="mb-3 row">
                    <label htmlFor="password" className="col-form-label text-start">Password</label>
                    <div>
                        <input onChange={handleChange} type="password" className="form-control" name='password' id="password" value={formData.password} />
                    </div>
                </div>
                <div className="buttons">
                    <button onClick={handleCreateAccount} className="btn btn-primary">Create new account</button>
                    <button onClick={() => navigate('/')} className="btn btn-primary mx-2">Go back</button>

                </div>
            </form>
        </div>
    </div>

}

export default Signup