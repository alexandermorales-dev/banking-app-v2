import React from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const navigate = useNavigate()
    return <div>
        <h1>Dashboard</h1>
        <button onClick={() => navigate('/')} className="btn btn-primary mx-2">Go back</button>

    </div>
}

export default Dashboard