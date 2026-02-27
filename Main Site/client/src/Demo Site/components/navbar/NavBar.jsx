import React, {useState} from "react"
import { NavLink } from "react-router-dom";
import "./NavBar.css"

function NavBar(){
	return(
<header className="p-3 custom-navbar">
  <nav className="navbar navbar-expand-lg navbar-dark p-0">
    <div className="container-fluid px-lg-5">
      
      {/* BRANDING: Now uses flex utilities to stay centered on mobile naturally */}
      <div className="d-flex flex-grow-1 flex-lg-grow-0 justify-content-center justify-content-lg-start">
        <a href="/" className="navbar-brand brand-container d-flex align-items-center m-0">
          <img className="bi" width="50" height="50" src={"/images/logo.jpg"} alt="Logo" />
          <span className="dealership-title ms-2">Car Dealership</span>
        </a>
      </div>

      {/* HAMBURGER BUTTON */}
      <button 
        className="navbar-toggler border-0 shadow-none" 
        type="button" 
        data-bs-toggle="collapse" 
        data-bs-target="#navContent" 
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      {/* COLLAPSIBLE CONTENT */}
      <div className="collapse navbar-collapse" id="navContent">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4 text-center">
          <li className="nav-item">
            <a href="/demo/01" className="nav-link px-3 text-white">Home</a>
          </li>
          <li className="nav-item">
            <a href="/demo/01/inventory" className="nav-link px-3 text-white">Inventory</a>
          </li>
          <li className="nav-item">
            <a href="/demo/01/team" className="nav-link px-3 text-white">Our Team</a>
          </li>
          <li className="nav-item">
            <a href="/demo/01/contact" className="nav-link px-3 text-white">Contact Us</a>
          </li>
        </ul>

        {/* SEARCH BAR (Desktop Only) */}
        <form className="d-none d-lg-block" role="search" style={{ width: '250px' }}>
          <div className="search-wrapper">
            <input type="search" className="form-control search-input-custom" placeholder="Search any car..." />
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search search-icon" viewBox="0 0 16 16">
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
            </svg>
          </div>
        </form>
      </div>
      
    </div>
  </nav>
</header>
	);
}

export default NavBar;