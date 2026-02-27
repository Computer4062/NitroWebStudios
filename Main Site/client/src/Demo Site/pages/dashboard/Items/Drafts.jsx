import {useState, useEffect} from "react"
import { useNavigate, Link } from "react-router-dom";

import Dash from "../../../components/Dashboard/Dash.jsx"
import Nav from "../../../components/Dashboard/Nav.jsx"

function Drafts() {
  const navigate = useNavigate();
  
  const [isAdmin, setIsAdmin] = useState(true);

	// Fetch the items from the database

	const [items, setItems] = useState([]);
	const [searchQuery, setSearchQuery] = useState(""); // for search string

  useEffect(() => {
    fetch('http://localhost:3000/api/vehicles/drafts')
      .then((response) => response.json())
      .then((data) => {
	  	setItems(data);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, []);

  const displayedItems = items.filter((item) => {
	const query = searchQuery.toLowerCase();

	// Check if query exsists in model, year, or type
	return (
		item.model?.toLowerCase().includes(query) ||
		item.year?.toString().includes(query) ||
		item.type?.toLowerCase().includes(query)
	);
  });

  return (
    <>
		<Dash />

      <div class="container-fluid">
      <div class="row">
	  	<Nav isAdmin={isAdmin} />

        <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">

		{/* This the title and description of the page in this dashboard */}
          <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 class="h2">Inventory - Drafts</h1>
          </div>

		{/* This the search bar to find specific items from the inventory */}
		<div class="row mb-4 justify-content-center">
		<div class="col-12 col-md-8 col-lg-6">
			<div class="input-group shadow-sm">
			<input 
				type="text" 
				class="form-control border-secondary-subtle" 
				placeholder="Search Drafts..." 
				aria-label="Search Inventory"
				aria-describedby="button-search"
				value={searchQuery}
				onChange={(e) => setSearchQuery(e.target.value)}
			/>
			<button 
				class="btn btn-primary px-4" 
				type="button" 
				id="button-search"
			>
				<i class="bi bi-search"></i>
			</button>
			</div>
		</div>
		</div>

		{/* This is the container holding the items */}
			<div class="container-fluid px-0">
			<div class="row g-3">
				{/* These are the individual cards holding up each item */}
				{displayedItems.map((item, index) => (
				<div class="col-12 col-md-6 col-xl-4" key={item._id}>
					<div class="card h-100 shadow-sm">
					<div class="row g-0 align-items-center">
						
						{/* Left Side: Image */}
						<div class="col-4 col-sm-3">
						<img 
							src={`http://localhost:3000/public/images/${item.images[0]}`}
							class="img-fluid rounded-start object-fit-cover" 
							alt={item.name}
							style={{ height: '120px', width: '100%' }}
						/>
						</div>

						{/* Right Side: Data & Actions */}
						<div class="col-8 col-sm-9">
						<div class="card-body p-3 h-100 d-flex flex-column justify-content-between">
							<div>
							<p class="card-title mb-1">{item.model} {item.year}</p>
							<p class="text-muted small mb-0">{item.type}</p>
							</div>

							<div class="d-flex justify-content-between align-items-center mt-3">
              					<Link to={`/dashboard/items/editor`} type="button" className="btn btn-sm btn-outline-primary px-3">
									<i class="bi bi-pencil-square me-1"></i> Edit
								</Link>
							</div>
						</div>
						</div>

					</div>
					</div>
				</div>
				))}
			</div>
			</div>

        </main>
      </div>
      </div>
    </>
  )
}

export default Drafts;