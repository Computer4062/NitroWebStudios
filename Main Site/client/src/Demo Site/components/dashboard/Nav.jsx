import {useState, useEffect} from "react"
import { useNavigate } from "react-router-dom";

import "./Nav.css"

function Nav({isAdmin}) {
	const navigate = useNavigate();

	const handleLogout = async() => {
    navigate("/");
	}

  return (
    <>
      {/* The main sidebar container */}
      <div className="sidebar sticky-sidebar col-md-3 col-lg-2 p-0 bg-white border-end">
        <div className="offcanvas-md offcanvas-end h-100" tabIndex="-1" id="sidebarMenu">
          
          {/* CHANGE HERE: Added 'h-100' and 'flex-nowrap' 
              to ensure the container is a full-height flexbox 
          */}
          <div className="offcanvas-body d-md-flex flex-column p-0 pt-lg-3 h-100 flex-nowrap">
            
            {/* Top Navigation Group */}
            <div className="flex-grow-1">
                {/* Main Navigation */}
                <ul className="nav flex-column px-3 gap-1">
                  <li className="nav-item">
                    <a className="nav-link d-flex align-items-center gap-2 active fw-bold text-primary rounded-2 bg-primary bg-opacity-10" href="/demo/01/dashboard">
                      <i className="bi bi-speedometer2"></i> Dashboard
                    </a>
                  </li>
                </ul>

                {/* Inventory Section */}
                <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-4 mt-4 mb-2 text-muted text-uppercase small">
                  <span style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>Inventory</span>
                </h6>
                <ul className="nav flex-column px-3 gap-1">
                  <li className="nav-item">
                    <a className="nav-link d-flex align-items-center gap-2 text-dark" href="/demo/01/dashboard/items">
                      <i className="bi bi-box-seam"></i> Existing Stock
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link d-flex align-items-center gap-2 small text-secondary" href="/demo/01/dashboard/items/add">
                      <i className="bi bi-plus-circle"></i> Add New
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link d-flex align-items-center gap-2 small text-secondary" href="/demo/01/dashboard/items/drafts">
                      <i className="bi bi-file-earmark-text"></i> Drafts
                    </a>
                  </li>
                </ul>

                {/* Management Section */}
                <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-4 mt-4 mb-2 text-muted text-uppercase small">
                  <span style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>Site Management</span>
                </h6>
                <ul className="nav flex-column px-3 gap-1">
                  <li className="nav-item">
                    <a className="nav-link d-flex align-items-center gap-2 text-dark" href="/demo/01/dashboard/site-editor">
                      <i className="bi bi-window-sidebar"></i> Edit Site
                    </a>
                  </li>
                  {isAdmin && (
                    <li className="nav-item">
                      <a className="nav-link d-flex align-items-center gap-2 text-dark" href="/demo/01/dashboard">
                        <i className="bi bi-people"></i> Accounts
                      </a>
                    </li>
                  )}
                </ul>
            </div>

            {/* FOOTER SECTION: 
                This will now stay at the bottom because the div above it 
                has 'flex-grow-1' 
            */}
            <div className="px-3 pb-4">
              <hr className="my-3 opacity-10" />
              <ul className="nav flex-column gap-1">
                <li className="nav-item">
                  <a className="nav-link d-flex align-items-center gap-2 text-dark" href="/demo/01/dashboard/profile">
                    <i className="bi bi-person-circle"></i> My Profile
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link d-flex align-items-center gap-2 text-danger mt-2" href="#" onClick={(e) => handleLogout()}>
                    <i className="bi bi-box-arrow-right"></i> Sign out
                  </a>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}

export default Nav;