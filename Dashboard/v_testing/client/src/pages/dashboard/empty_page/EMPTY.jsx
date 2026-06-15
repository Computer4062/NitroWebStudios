import {useState, useEffect, useRef} from "react"

import Dash from "../../../components/dashboard/Dash.jsx"
import Nav from "../../../components/dashboard/Nav.jsx"

function Profile() {
  return (
    <>
      <Dash />

      <div class="container-fluid">
      <div class="row">

        <Nav/>

        <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4 bg-light min-vh-100">
		<div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-4 border-bottom">
			<div>
			<nav aria-label="breadcrumb">
				<ol className="breadcrumb mb-1">
				<li className="breadcrumb-item small text-muted">EMPTY</li>
				<li className="breadcrumb-item small active" aria-current="page">EMPTY</li>
				</ol>
			</nav>
			<h1 className="h3 fw-bold text-dark">EMPTY</h1>
			</div>
			
			{/*
			<div className="btn-toolbar mb-2 mb-md-0">
			<Link to="/dashboard/items/add" className="btn btn-primary shadow-sm d-flex align-items-center gap-2">
				<i className="bi bi-plus-lg"></i> Add a new Vehicle
			</Link>
			</div>
			*/}
		</div>

		<div className="card border-0 shadow-sm mb-4">
			<div className="card-body p-3"></div>
		</div>

        </main>

      </div>
      </div>
    </>
  )
}

export default Profile;