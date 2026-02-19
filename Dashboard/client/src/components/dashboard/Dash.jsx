import {useState, useEffect} from "react"

function Dash() {
  return (
    <>
      <header class="navbar sticky-top bg-dark flex-md-nowrap p-0 shadow" data-bs-theme="dark">
      <a class="navbar-brand col-md-3 col-lg-2 me-0 px-3 fs-6 text-white" href="#">Demo Pizza</a>
      <ul class="navbar-nav flex-row d-md-none">
        <li class="nav-item text-nowrap">
          <button class="nav-link px-3 text-white collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSearch" aria-controls="navbarSearch" aria-expanded="false" aria-label="Toggle search">
            Search
          </button>
        </li>
        <li class="nav-item text-nowrap">
          <button class="nav-link px-3 text-white" type="button" data-bs-toggle="offcanvas" data-bs-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="false" aria-label="Toggle navigation">
            Options
          </button>
        </li>
      </ul>
      </header>
    </>
  )
}

export default Dash;