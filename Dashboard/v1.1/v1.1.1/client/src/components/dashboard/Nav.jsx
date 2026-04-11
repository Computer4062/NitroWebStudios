import {useState, useEffect} from "react"
import { useNavigate} from "react-router-dom";

import "./Nav.css"

function Nav() {
	const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
	const checkUserAuth = async() => {
		try{
			const response = await fetch("http://localhost:3000/api/accounts/check-auth", {
				method: 'GET',
				credentials: 'include'
			});

			if(response.status === 401){
				// If not logged in, kick them to login page
				navigate("/login");
      }

      const data = await response.json();
      setIsAdmin(data.admin);

		} catch(error) {
			navigate("/login");
		}
	}

	checkUserAuth();
  }, [navigate]);

	const handleLogout = async() => {
		try{
			await fetch('http://localhost:3000/api/accounts/logout', {
				method: 'POST',
				credentials: 'include'
			});

			navigate("/login");
		} catch(error) {
			console.error("Logout failed ", error);
		}
	}

  return (
    <>

  <div className="sidebar sticky-sidebar col-md-3 col-lg-2 p-0 bg-white border-end">
    {/* Added 'vh-100' to ensure the mobile drawer takes full screen height */}
    <div className="offcanvas-md offcanvas-end vh-100" tabIndex="-1" id="sidebarMenu">
      
      <div className="offcanvas-header border-bottom d-md-none">
        <h5 className="offcanvas-title">NW Studios</h5>
        <button type="button" className="btn-close" data-bs-dismiss="offcanvas" data-bs-target="#sidebarMenu"></button>
      </div>

      {/* Key Change: Added 'h-100' and 'd-flex flex-column'. 
        This creates a vertical box that spans the full height of the drawer.
      */}
      <div className="offcanvas-body d-flex flex-column p-0 pt-lg-3 h-100">
        
        {/* Top Section Wrapper */}
        <div className="flex-grow-1">
          {/* Main Navigation */}
          <ul className="nav flex-column px-3 gap-1">
            <li className="nav-item">
              <a className="nav-link d-flex align-items-center gap-2 active fw-bold text-primary rounded-2 bg-primary bg-opacity-10" href="/dashboard">
                <i className="bi bi-speedometer2"></i> Dashboard v1.1.1
              </a>
            </li>
          </ul>

          {/* Inventory Section */}
          <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-4 mt-4 mb-2 text-muted text-uppercase small">
            <span>Inventory</span>
          </h6>
          <ul className="nav flex-column px-3 gap-1">
            <li className="nav-item">
              <a className="nav-link d-flex align-items-center gap-2 text-dark" href="/dashboard/items">
                <i className="bi bi-box-seam"></i> Existing Stock
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link d-flex align-items-center gap-2 small text-secondary" href="/dashboard/items/add">
                <i className="bi bi-plus-circle"></i> Add New
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link d-flex align-items-center gap-2 small text-secondary" href="/dashboard/items/drafts">
                <i className="bi bi-file-earmark-text"></i> Drafts
              </a>
            </li>
          </ul>

          {/* Management Section */}
          <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-4 mt-4 mb-2 text-muted text-uppercase small">
            <span>Site Management</span>
          </h6>
          <ul className="nav flex-column px-3 gap-1">

            <li className="nav-item">
              <a className="nav-link d-flex align-items-center gap-2 text-dark" href="/dashboard/logs">
                <i className="bi bi-journal-text"></i> Logs
              </a>
            </li>

            <li className="nav-item">
              <a className="nav-link d-flex align-items-center gap-2 text-dark" href="/dashboard/database">
                <i className="bi bi-database"></i> Database
              </a>
            </li>

            <li className="nav-item">
              <a className="nav-link d-flex align-items-center gap-2 text-dark" href="/dashboard/siteeditor" target="_blank">
                <i className="bi bi-pencil-square"></i> Site Editor
              </a>
            </li>
          </ul>

        {/* Bottom Section Wrapper 
          'mt-auto' works here because the parent is 'd-flex flex-column h-100'
        */}
        <div className="mt-auto px-3 pb-4 border-top pt-3 bg-white">
          <ul className="nav flex-column gap-1">
            <li className="nav-item">
              <a className="nav-link d-flex align-items-center gap-2 text-dark" href="/dashboard/info">
                <i className="bi bi-question-circle"></i> Info
              </a>
            </li>

            <li className="nav-item">
              <a className="nav-link d-flex align-items-center gap-2 text-danger mt-1" href="#" onClick={(e) => handleLogout()}>
                <i className="bi bi-box-arrow-right"></i> Sign out
              </a>
            </li>
          </ul>
        </div>

      </div>
    </div>
    </div>
  </div>
    </>
  )
  }

export default Nav;