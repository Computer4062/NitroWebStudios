import {useState, useEffect} from "react"

function Dash() {
  return (
    <>
      <header class="navbar sticky-top bg-dark flex-md-nowrap p-0 shadow" data-bs-theme="dark">
      <a class="navbar-brand col-md-3 col-lg-2 me-0 px-3 fs-6 text-white" href="#">NW Studios</a>
      <ul class="navbar-nav flex-row d-md-none">
<li class="nav-item text-nowrap">
  <button class="nav-link px-3 text-white" type="button" data-bs-toggle="offcanvas" data-bs-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="false" aria-label="Toggle navigation">
    <i class="bi bi-list" style={{"fontSize": '1.5rem'}}></i>
  </button>
</li>
      </ul>
      </header>
    </>
  )
}

export default Dash;