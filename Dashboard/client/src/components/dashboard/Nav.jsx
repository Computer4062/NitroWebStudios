import {useState, useEffect} from "react"
import { useNavigate } from "react-router-dom";

function Nav({isAdmin}) {
	const navigate = useNavigate();

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
        <div class="sidebar border border-right col-md-3 col-lg-2 p-0 bg-body-tertiary">
          <div class="offcanvas-md offcanvas-end bg-body-tertiary" tabindex="-1" id="sidebarMenu" aria-labelledby="sidebarMenuLabel">
            <div class="offcanvas-header">
              <h5 class="offcanvas-title" id="sidebarMenuLabel">Demo Pizza</h5>
              <button type="button" class="btn-close" data-bs-dismiss="offcanvas" data-bs-target="#sidebarMenu" aria-label="Close"></button>
            </div>
            <div class="offcanvas-body d-md-flex flex-column p-0 pt-lg-3 overflow-y-auto vh-100">
              <ul class="nav flex-column">
                <li class="nav-item">
                  <a class="nav-link d-flex align-items-center gap-2 active" aria-current="page" href="#"> Dashboard </a>
                </li>
                <li class="nav-item">
                  <a class="nav-link d-flex align-items-center gap-2" href="#">Edit Site</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link d-flex align-items-center gap-2" href="#">Messages</a>
                </li>
				<li class="nav-item">
                  <a class="nav-link d-flex align-items-center gap-2" href="#">Drafts</a>
                </li>
				{isAdmin && (
				<li class="nav-item">
                  <a class="nav-link d-flex align-items-center gap-2" href="#">Accounts</a>
                </li>
				)}
              </ul>
              <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-body-secondary text-uppercase">
                <span>SETTINGS</span>
              </h6>

              <hr class="my-3" />
              <ul class="nav flex-column mb-auto">
                <li class="nav-item">
                  <a class="nav-link d-flex align-items-center gap-2" href="#">My Profile </a>
                </li>
                <li class="nav-item">
                  <a class="nav-link d-flex align-items-center gap-2" href="#" onClick={(e) => handleLogout()}>Sign out </a>
                </li>
              </ul>
            </div>
        </div>
        </div>
    </>
  )
}

export default Nav;