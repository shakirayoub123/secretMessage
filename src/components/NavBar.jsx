import React from 'react';
import { Link } from 'react-router-dom';
import '../index.css';

const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark mt-2 pb-2">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">YOUR SECRET</Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link className="nav-link active" aria-current="page" to="/">HOME</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/features">FEATURES</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/signin">SIGN IN</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
