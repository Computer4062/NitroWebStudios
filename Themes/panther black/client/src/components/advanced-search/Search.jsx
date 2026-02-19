import React from "react"

import './Search.css'

function Search(){
	return(
	<div class="search-container" style={{ display: "block", margin: "0" }}>
		<div class="container d-flex align-items-center h-100">
			<div class="me-auto" style={{maxWidth: "350px"}}>
				<h3 
				className="ps-3 mb-3" 
				style={{ 
					borderLeft: "4px solid #E62117", 
					fontWeight: "700", 
					fontSize: "1.5rem",
					letterSpacing: "-0.5px",
					textTransform: "uppercase",
					color: "#333" // Or "white" if this is sitting over your dark banner image
				}}
				>
				Find Your Car
				</h3>

				<div class="input-group input-group-sm mb-2">
					<span class="input-group-text" style={{ backgroundColor: "#E62117", color: "white", borderColor: "#E62117" }}>Model</span>
					<input type="text" class="form-control" style={{ backgroundColor: "white", color: "black", borderColor: "#E62117", outline: "none"}} placeholder="e.g. Civic" />
				</div>

				<div class="input-group input-group-sm mb-2">
					<span class="input-group-text search-label" style={{ backgroundColor: "#E62117", color: "white", borderColor: "#E62117" }}>Price</span>
					<input type="number" class="form-control" placeholder="Min" style={{ backgroundColor: "white", color: "black", borderColor: "#E62117", outline: "none"}} />
					<input type="number" class="form-control" placeholder="Max" style={{ backgroundColor: "white", color: "black", borderColor: "#E62117", outline: "none"}} />
				</div>

				<div class="d-flex gap-2">
					<div class="btn-group btn-group-sm" role="group">
						<input type="radio" class="btn-check" name="cond" id="unused" />
						<label class="btn btn-outline-danger" for="unused">New</label>
						<input type="radio" class="btn-check" name="cond" id="used" />
						<label class="btn btn-outline-danger" for="used">Used</label>
					</div>

					<div class="btn-group btn-group-sm" role="group">
						<input type="radio" class="btn-check" name="fuel" id="gas" />
						<label class="btn btn-outline-danger" for="gas">Gas</label>
						<input type="radio" class="btn-check" name="fuel" id="elec"/>
						<label class="btn btn-outline-danger" for="elec">EV</label>
					</div>
				</div>

				<div class="d-grid mt-2">
					<button type="button" class="btn btn-danger btn-sm">Find Vehicle</button>
				</div>
			</div>
		</div>
	</div>
	);
}

export default Search;