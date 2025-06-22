import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../component/navbar";

const Home = () => {
    const navigate = useNavigate();
    return <div>
        <Navbar />
        <main>
            {/* Hero Section: Banking Focus */}
            <section className="bg-primary text-white text-center py-5 py-md-5 mb-5">
                <div className="container px-3 py-4 px-md-5">
                    <h1 className="display-4 fw-bold mb-3">
                        Your Trusted Partner in Banking
                    </h1>
                    <p className="lead mb-4 mx-auto" style={{ maxWidth: '700px' }}>
                        Secure, simple, and smart banking solutions designed for your financial well-being.
                        Manage your money with ease, anytime, anywhere.
                    </p>
                    <button onClick={() => navigate('/signup')} className="btn btn-light text-primary rounded-pill px-4 py-2 fw-semibold shadow-sm">
                        Open Account Today
                    </button>
                </div>
            </section>

            {/* Key Benefits Section */}
            <section className="container py-5 my-5">
                <div className="text-center mb-5">
                    <h2 className="display-5 fw-bold text-dark mb-3">Experience Modern Banking</h2>
                    <p className="lead text-secondary mx-auto" style={{ maxWidth: '600px' }}>
                        From daily transactions to long-term savings, we've got you covered.
                    </p>
                </div>
                <div className="row row-cols-1 row-cols-md-3 g-4">
                    {/* Benefit Card 1: Secure Transactions */}
                    <div className="col">
                        <div className="card h-100 border-0 shadow-sm rounded-4 p-4 text-center">
                            <div className="card-body">
                                <div className="text-primary mb-3 fs-1">🛡️</div> {/* Icon placeholder */}
                                <h3 className="card-title fs-4 fw-semibold mb-2">Secure & Protected</h3>
                                <p className="card-text text-secondary">
                                    Your money and data are safe with our advanced security measures.
                                </p>
                            </div>
                        </div>
                    </div>
                    {/* Benefit Card 2: Easy Transfers */}
                    <div className="col">
                        <div className="card h-100 border-0 shadow-sm rounded-4 p-4 text-center">
                            <div className="card-body">
                                <div className="text-success mb-3 fs-1">💸</div> {/* Icon placeholder */}
                                <h3 className="card-title fs-4 fw-semibold mb-2">Effortless Transfers</h3>
                                <p className="card-text text-secondary">
                                    Send and receive money instantly, across different banks.
                                </p>
                            </div>
                        </div>
                    </div>
                    {/* Benefit Card 3: 24/7 Support */}
                    <div className="col">
                        <div className="card h-100 border-0 shadow-sm rounded-4 p-4 text-center">
                            <div className="card-body">
                                <div className="text-info mb-3 fs-1">📞</div> {/* Icon placeholder */}
                                <h3 className="card-title fs-4 fw-semibold mb-2">Dedicated Support</h3>
                                <p className="card-text text-secondary">
                                    Our team is available 24/7 to assist you with any query.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <hr className="my-5" />

            {/* Why Choose Us Section */}
            <section className="container py-5 my-5">
                <div className="row g-5 align-items-center">
                    <div className="col-md-7 order-md-2">
                        <h2 className="featurette-heading fw-bold">Personalized Financial Tools. <span className="text-muted">Tailored for you.</span></h2>
                        <p className="lead text-secondary">
                            Access budgeting tools, spending insights, and investment options
                            all designed to help you reach your financial goals faster.
                        </p>
                    </div>
                    <div className="col-md-5 order-md-1">
                        <img
                            src="https://jaro-website.s3.ap-south-1.amazonaws.com/2024/10/Why-Are-Financial-Management-Tools-Important-1.jpg"
                            className="img-fluid rounded-4 shadow-sm"
                            alt="Personalized Financial Tools"
                        />
                    </div>
                </div>

                <hr className="my-5" />

                <div className="row g-5 align-items-center">
                    <div className="col-md-7">
                        <h2 className="featurette-heading fw-bold">Competitive Rates. <span className="text-muted">More for your money.</span></h2>
                        <p className="lead text-secondary">
                            Benefit from industry-leading interest rates on savings and flexible
                            loan options that fit your life.
                        </p>
                    </div>
                    <div className="col-md-5">
                        <img
                            src="https://cdn.mozo.com.au/images/atwood/481/fixed-interest-rates_content.jpg"
                            className="img-fluid rounded-4 shadow-sm"
                            alt="Competitive Rates"

                        />
                    </div>
                </div>
            </section>

            {/* Final Call to Action: Open Account */}
            <section className="bg-light text-center py-5 mb-5">
                <div className="container">
                    <h2 className="fw-bold mb-4">Ready to Bank Smarter?</h2>
                    <p className="lead mb-4">
                        Join thousands who trust us with their financial journey.
                    </p>
                    <button onClick={() => navigate('/signup')} className="btn btn-primary rounded-pill px-4 py-2 fw-semibold">
                        Open an Account
                    </button>
                </div>
            </section>
        </main>
    </div>;
};

export default Home;
