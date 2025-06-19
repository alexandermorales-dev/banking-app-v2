import React from "react";
import { useState } from "react";
import { useContext } from "react";
import { Context } from "../store/appContext";

const Signup = () => {
    const { actions, store } = useContext(Context)
    const [formData, setFormData] = useState({ name: '', email: '', password: '' })

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
        if (!res) return alert('user already exists')
        alert(res)
        setFormData({ name: '', email: '', password: '' });



    }
    return <>
        <form className="col-6">

            <div className="mb-3 row">
                <label htmlFor="name" className="col-sm-2 col-form-label">Name</label>
                <div>
                    <input onChange={handleChange} type="text" className="form-control" name='name' id="name" value={formData.name} />
                </div>
            </div>
            <div className="mb-3 row">
                <label htmlFor="email" className="col-sm-2 col-form-label">Email</label>
                <div>
                    <input onChange={handleChange} type="text" className="form-control" name='email' id="email" value={formData.email} />
                </div>
            </div>
            <div className="mb-3 row">
                <label htmlFor="password" className="col-sm-2 col-form-label">Password</label>
                <div>
                    <input onChange={handleChange} type="password" className="form-control" name='password' id="password" value={formData.password} />
                </div>
            </div>
            <div className="buttons">
                <button onClick={handleCreateAccount} className="btn btn-primary">Create new account</button>
            </div>
        </form>
    </>
}

export default Signup