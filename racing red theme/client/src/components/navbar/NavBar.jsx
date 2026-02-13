import React from "react"
import { NavLink } from "react-router-dom";
import "./NavBar.css"

function NavBar(){
	return(
<nav className="navbar navbar-expand-md navbar-light py-3 navbar-site">
    <div className="container">
        <a href="/" className="navbar-brand d-flex align-items-center link-body-emphasis text-decoration-none">
            <img className="bi me-2" width="50" height="50" src={"../../../public/images/logo.jpg"} alt="Logo" />
            {/* Removed fw-bold here */}
            <span className="fs-4 dealership-title">Car Dealership</span>
        </a>

        <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#mainNavbar" 
        >
            <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="mainNavbar">
            {/* 'flex-md-row' ensures they stay in one line on desktop */}
            <ul className="navbar-nav ms-auto custom-red-pills nav-pills d-flex flex-column flex-md-row align-items-center">
                <li className="nav-item">
                    <NavLink to="/" className="nav-link" end>Home</NavLink>
                </li>
                <li className="nav-item">
                    <NavLink to="/inventory" className="nav-link">Inventory</NavLink>
                </li>
                <li className="nav-item">
                    <NavLink to="/team" className="nav-link">Our Team</NavLink>
                </li>
                <li className="nav-item">
                    <NavLink to="/contact" className="nav-link">Contact Us</NavLink>
                </li>
            </ul>
        </div>
    </div>
</nav>
	);
}

export default NavBar;