import {useState, useEffect} from "react"
import { useNavigate} from "react-router-dom";
import api from "../../api.jsx";

import "./Nav.css"

function Nav() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkUserAuth = async () => {
      try {
        const response = await api.get('/api/accounts/check-auth', {
          withCredentials: true
        });

        // axios already parses the JSON body into response.data — no .json() needed
        setIsAdmin(response.data.admin);

      } catch (error) {
        // Axios throws here on 401 (or any non-2xx), so this is the correct
        // place to handle "not logged in"
        navigate("/");
      }
    }

    checkUserAuth();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await api.post('/api/accounts/user/logout', {}, {
        withCredentials: true
      });

      navigate("/");
    } catch (error) {
      console.error("Logout failed ", error);
    }
  }

  return (
    <>
      <div className="sidebar sticky-sidebar col-md-3 col-lg-2 p-0 bg-dark border-end border-secondary">
        <div className="offcanvas-md offcanvas-end vh-100 bg-dark" tabIndex="-1" id="sidebarMenu">

          <div className="offcanvas-header border-bottom border-secondary d-md-none">
            <h5 className="offcanvas-title text-white">NW Studios</h5>
            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" data-bs-target="#sidebarMenu"></button>
          </div>

          <div className="offcanvas-body d-flex flex-column p-0 pt-lg-3 h-100 justify-content-between">

            <div className="flex-grow-1">
              {/* Main Navigation */}
              <ul className="nav flex-column px-3 gap-1">
                <li className="nav-item">
                  <a className="nav-link d-flex align-items-center gap-2 fw-bold text-white rounded-2 " href="/nws-dash/dashboard">
                    <i className="bi bi-speedometer2"></i> Dashboard
                  </a>
                </li>
              </ul>

              {/* Inventory Section */}
              <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-4 mt-4 mb-2 text-secondary text-uppercase small">
                <span>Inventory</span>
              </h6>
              <ul className="nav flex-column px-3 gap-1">
                <li className="nav-item">
                  <a className="nav-link d-flex align-items-center gap-2 text-white sidebar-link" href="/nws-dash/dashboard/items">
                    <i className="bi bi-car-front"></i> Vehicles
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link d-flex align-items-center gap-2 text-white sidebar-link" href="/nws-dash/dashboard/items/add">
                    <i className="bi bi-plus-circle"></i> Add New
                  </a>
                </li>
              </ul>

              {/* Management Section */}
              <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-4 mt-4 mb-2 text-secondary text-uppercase small">
                <span>Site Management</span>
              </h6>
              <ul className="nav flex-column px-3 gap-1">
                <li className="nav-item">
                  <a className="nav-link d-flex align-items-center gap-2 text-white sidebar-link" href="/nws-dash/dashboard/logs">
                    <i className="bi bi-journal-text"></i> Logs
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link d-flex align-items-center gap-2 text-white sidebar-link" href="/nws-dash/dashboard/database">
                    <i className="bi bi-database"></i> Database
                  </a>
                </li>
              </ul>

              {/* Accounts Section */}
              <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-4 mt-4 mb-2 text-secondary text-uppercase small">
                <span>Account Management</span>
              </h6>
              <ul className="nav flex-column px-3 gap-1">
                {isAdmin && (
                  <li className="nav-item">
                    <a className="nav-link d-flex align-items-center gap-2 text-white sidebar-link" href="/nws-dash/dashboard/accounts">
                      <i className="bi bi-people"></i> Manage Accounts
                    </a>
                  </li>
                )}
                <li className="nav-item">
                  <a className="nav-link d-flex align-items-center gap-2 text-white sidebar-link" href="/nws-dash/dashboard/profile">
                    <i className="bi bi-person-circle"></i> My Profile
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link d-flex align-items-center gap-2 text-white sidebar-link" href="/nws-dash/dashboard/mylistings">
                    <i className="bi bi-collection"></i> My Listings
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link d-flex align-items-center gap-2 text-white sidebar-link" href="/nws-dash/dashboard/info">
                    <i className="bi bi-question-circle"></i> Info
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link d-flex align-items-center gap-2 text-danger sidebar-link-danger" href="#" onClick={(e) => handleLogout()}>
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