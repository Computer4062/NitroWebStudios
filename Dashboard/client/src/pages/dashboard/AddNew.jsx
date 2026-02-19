import {useState, useEffect} from "react"
import { useNavigate } from "react-router-dom";

import Dash from "../../components/Dashboard/Dash.jsx"
import Nav from "../../components/Dashboard/Nav.jsx"

function AddNew() {
  const navigate = useNavigate();

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
	  	<Nav />
		
        <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">

			<div class="row g-5 my-3">
				<div class="col-md-7 col-lg-8">
					<h4 class="mb-3">Add new food items</h4>
					<form class="needs-validation" novalidate="">
						<div class="row g-3">
							<div class="col-sm-6">
								<label for="firstName" class="form-label">Type</label>
								<input type="text" class="form-control" id="firstName" placeholder="" value="" required="" />
							</div>
							<div class="col-12">
								<label for="firstName" class="form-label">Name</label>
								<input type="text" class="form-control" id="firstName" placeholder="" value="" required="" />
							</div>
							<div class="col-12">
								<label for="firstName" class="form-label">Price</label>
								<input type="text" class="form-control" id="firstName" placeholder="" value="" required="" />
							</div>
							<div class="col-12">
								<label for="firstName" class="form-label">Description</label>
								<input type="text" class="form-control" style={{height: "100px"}} id="firstName" placeholder="" value="" required="" />
							</div>
						</div>
						<hr class="my-4" />
						<div class="form-check">
							<input type="checkbox" class="form-check-input" id="same-address" />
							<label class="form-check-label" for="same-address">Has special Offer</label>
						</div>
						<hr class="my-4" />
						<h4 class="mb-3">Add images</h4>
						<div class="my-3">
							<div class="input-group mb-3">
							<label class="input-group-text" for="inputGroupFile01">Upload</label>
							<input type="file" class="form-control" id="inputGroupFile01" />
							</div>
						</div>
						<hr class="my-4" />
						<button class="w-100 btn btn-primary btn-lg" type="submit">Add Item</button>
					</form>
				</div>
			</div>

        </main>
      </div>
      </div>
    </>
  )
}

export default AddNew;