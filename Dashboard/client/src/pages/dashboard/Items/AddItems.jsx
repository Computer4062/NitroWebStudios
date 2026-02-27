import {useState, useEffect} from "react"
import { useNavigate } from "react-router-dom";

import Dash from "../../../components/Dashboard/Dash.jsx"
import Nav from "../../../components/Dashboard/Nav.jsx"

function AddItems() {
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

  return (
    <>
      <Dash />

      <div class="container-fluid">
      <div class="row">

        <Nav isAdmin={isAdmin} />

    	<main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
			<div className="container py-5">
			<div className="card shadow-sm">
				<div className="card-header bg-primary text-white py-3">
				<h5 className="mb-0">Add New Vehicle to Inventory</h5>
				</div>
				<div className="card-body p-4">
				<form>
					
					{/* Section 1: Basic Information */}
					<div className="row g-3 mb-4">
					<div className="col-12"><h6 className="text-muted border-bottom pb-2">Basic Details</h6></div>
					<div className="col-md-4">
						<label className="form-label">Make</label>
						<input type="text" className="form-control" placeholder="e.g. Kia" defaultValue="Kia" />
					</div>
					<div className="col-md-4">
						<label className="form-label">Model</label>
						<input type="text" className="form-control" placeholder="e.g. Pegas" defaultValue="Pegas" />
					</div>
					<div className="col-md-4">
						<label className="form-label">Year</label>
						<input type="number" className="form-control" defaultValue="2022" />
					</div>
					<div className="col-md-4">
						<label className="form-label">Type</label>
						<select className="form-select">
						<option>Sedan</option>
						<option>SUV</option>
						<option>Truck</option>
						<option>Coupe</option>
						</select>
					</div>
					<div className="col-md-4">
						<label className="form-label">Price ($)</label>
						<div className="input-group">
						<span className="input-group-text">$</span>
						<input type="number" className="form-control" defaultValue="2900" />
						</div>
					</div>
					<div className="col-md-4">
						<label className="form-label">Color</label>
						<input type="text" className="form-control" defaultValue="Gold" />
					</div>
					</div>

					{/* Section 2: Mechanical Details */}
					<div className="row g-3 mb-4">
					<div className="col-12"><h6 className="text-muted border-bottom pb-2">Specifications</h6></div>
					<div className="col-md-3">
						<label className="form-label">Fuel Type</label>
						<select className="form-select">
						<option>Petrol</option>
						<option>Diesel</option>
						<option>Hybrid</option>
						</select>
					</div>
					<div className="col-md-3">
						<label className="form-label">Transmission</label>
						<select className="form-select">
						<option>Automatic</option>
						<option>Manual</option>
						</select>
					</div>
					<div className="col-md-3">
						<label className="form-label">Cylinders</label>
						<input type="number" className="form-control" defaultValue="4" />
					</div>
					<div className="col-md-3">
						<label className="form-label">Doors</label>
						<input type="number" className="form-control" defaultValue="4" />
					</div>
					<div className="col-md-6">
						<label className="form-label">Mileage</label>
						<div className="input-group">
						<input type="number" className="form-control" defaultValue="86000" />
						<span className="input-group-text">km</span>
						</div>
					</div>
					<div className="col-md-6 d-flex align-items-end pb-2">
						<div className="form-check form-switch me-4">
						<input className="form-check-input" type="checkbox" id="electricSwitch" />
						<label className="form-check-label" htmlFor="electricSwitch">Electric Vehicle</label>
						</div>
						<div className="form-check">
						<input className="form-check-input" type="checkbox" id="featuredCheck" />
						<label className="form-check-label" htmlFor="featuredCheck">Featured Listing</label>
						</div>
					</div>
					</div>

					{/* Section 3: Media & Description */}
					<div className="row g-3 mb-4">
					<div className="col-12"><h6 className="text-muted border-bottom pb-2">Media & Notes</h6></div>
					<div className="col-12">
						<label className="form-label">Vehicle Images</label>
						<div className="border border-2 border-dashed rounded-3 p-4 text-center bg-light">
						<i className="bi bi-cloud-arrow-up fs-1 text-primary"></i>
						<p className="mb-2">Drag and drop images here or click to upload</p>
						<input type="file" className="form-control" multiple />
						<div className="form-text mt-2">Accepted formats: PNG, JPG (Max 3 images)</div>
						</div>
					</div>
					<div className="col-12">
						<label className="form-label">Description</label>
						<textarea className="form-control" rows="3" placeholder="Enter vehicle history or features..."></textarea>
					</div>
					</div>

					<div className="d-flex justify-content-end gap-2 border-top pt-4">
					<button type="submit" className="btn btn-light px-5">Save as Draft</button>
					<button type="submit" className="btn btn-primary px-5">Add to Stock</button>
					</div>
				</form>
				</div>
			</div>
			</div>
      	</main>

      </div>
      </div>
    </>
  )
}

export default AddItems;