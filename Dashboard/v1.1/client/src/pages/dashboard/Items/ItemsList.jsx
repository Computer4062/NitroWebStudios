import {useState, useEffect} from "react"
import { useNavigate, Link } from "react-router-dom";

import Dash from "../../../components/dashboard/Dash.jsx"
import Nav from "../../../components/dashboard/Nav.jsx"

function ItemsList() {
  const navigate = useNavigate();

	// Fetch the items from the database

	const [items, setItems] = useState([]);
	const [users, setUsers] = useState([]); // Raw fetched user profiles
	const [searchQuery, setSearchQuery] = useState(""); // for search string
	const [currentUser, setCurrentUser] = useState(null); // Stores the logged-in user object
	const [isAdmin, setIsAdmin] = useState();

  useEffect(() => {
    fetch('http://localhost:3000/api/stocks/all')
      .then((response) => response.json())
      .then((data) => {
	  	setItems(data);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, []);

  // --- 2. FETCHING LOGIC ---
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // A. Verify active authentication and get current logged-in user details
        const authRes = await fetch("http://localhost:3000/api/accounts/check-username", {
          credentials: 'include',
		  method: 'GET'
        });
        
        if (authRes.status === 401) {
          console.warn("User is unauthorized.");
          // Optional: navigate("/login") if you want a hard boot to login page
        } else {
          const authData = await authRes.json();
          // Assuming backend returns an object with a user sub-property (e.g., { user: { _id: "...", username: "..." } })
          setCurrentUser(authData.name);
        }

        // B. Fetch all registered user profiles (for the card footers)
        const usersRes = await fetch("http://localhost:3000/api/accounts/user/users", { 
          credentials: 'include',
		  method: 'GET'
        });
        const usersData = await usersRes.json();
        setUsers(usersData);

		// Check if user is an admin
		const usersAdmin = await fetch("http://localhost:3000/api/accounts/check-auth", { 
          credentials: 'include',
		  method: 'GET'
        });
		const userAdminData = await usersAdmin.json();
      	setIsAdmin(userAdminData.admin);
		console.log(userAdminData);

      } catch (error) {
        console.error("Error loading dashboard telemetry:", error);
      }
    };

    loadDashboardData();
  }, []);

	// Display items as per search in search box
  const displayedItems = items.filter((item) => {
	const query = searchQuery.toLowerCase();

	// Check if query exsists in model, year, or type
	return (
		item.model?.toLowerCase().includes(query) ||
		item.year?.toString().includes(query) ||
		item.type?.toLowerCase().includes(query)
	);
  });

  	// Function for handling the deletion of functions
	const handleDelete = async (id) => {
		const confirmDelete = window.confirm("Are you sure you want to delete this listing?");
		if (!confirmDelete) return;
  
		try {
			const response = await fetch(`http://localhost:3000/api/stocks/admin/delete/${id}`, {
				method: 'DELETE',
				credentials: 'include'
			});
  
			if (response.ok) {
				alert("Deleted successfully!");
				// IMPORTANT: Refresh your list or filter the state to remove the item from UI
				setItems(prevItems => prevItems.filter(item => item._id !== id));
			} else {
				alert("Failed to delete.");
			}
		} catch (error) {
			console.error("Delete error:", error);
		}
	};

  return (
    <>
		<Dash />

      <div class="container-fluid">
      <div class="row">
	  	<Nav />

		<main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 bg-light min-vh-100">

		{/* Header Section: Amazon-style Breadcrumbs & Actions */}
		<div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-4 border-bottom">
			<div>
			<nav aria-label="breadcrumb">
				<ol className="breadcrumb mb-1">
				<li className="breadcrumb-item small text-muted">Dashboard</li>
				<li className="breadcrumb-item small active" aria-current="page">Inventory</li>
				</ol>
			</nav>
			<h1 className="h3 fw-bold text-dark">Vehicle Inventory</h1>
			</div>
			
			<div className="btn-toolbar mb-2 mb-md-0">
			<Link to="/dashboard/items/add" className="btn btn-primary shadow-sm d-flex align-items-center gap-2">
				<i className="bi bi-plus-lg"></i> Add a new Vehicle
			</Link>
			</div>
		</div>

		{/* Search & Filter Bar: Professional Shadow & Refined Inputs */}
		<div className="card border-0 shadow-sm mb-4">
			<div className="card-body p-3">
			<div className="row g-2 align-items-center">
				<div className="col-md-8">
				<div className="input-group">
					<span className="input-group-text bg-white border-end-0">
					<i className="bi bi-search text-muted"></i>
					</span>
					<input 
					type="text" 
					className="form-control border-start-0 ps-0 shadow-none" 
					placeholder="Search by model, year, or VIN..." 
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>
				</div>
				<div className="col-md-4">
				<select className="form-select shadow-none">
					<option>All Types</option>
					<option>Sedan</option>
					<option>SUV</option>
					<option>Luxury</option>
				</select>
				</div>
			</div>
			</div>
		</div>

		{/* Inventory Grid */}
		<div className="container-fluid px-0">
			<div className="row g-3">
			{displayedItems.length === 0 ? (
				<div className="col-12 text-center text-muted py-5">
					<h5>No inventory items found.</h5>
				</div>
				) : (
				displayedItems.map((item) => {
					// Find the matching user profile info for the footer banner
					const matchedUser = users.find(u => u._id === item.user || u.username === item.user);
					const profileImage = matchedUser?.profile_img ? matchedUser.profile_img : 'default.jpg';
					const displayName = matchedUser 
					? `${matchedUser.first_name} ${matchedUser.last_name}` 
					: (item.user || 'Unknown User');

					// 🚀 OWNERSHIP CHECK ENGINE:
					// Safely compare current user's ID or Username against who created the item.
					// If currentUser is null, it naturally defaults to false.
					const isOwner = currentUser && (currentUser === item.user);

					return (
					<div className="col-12 col-xl-6" key={item._id}>
						<div className="card border-0 shadow-sm h-100 hover-shadow transition d-flex flex-column overflow-hidden">
						<div className="row g-0 flex-grow-1">
							
							{/* Image Section */}
							<div className="col-4 position-relative">
							<img 
								src={`http://localhost:3000/public${item.images && item.images ? item.images : ''}`}
								className="img-fluid object-fit-cover h-100 w-100" 
								alt={item.model || 'Vehicle'}
								style={{ minHeight: '160px' }}
							/>
							</div>

							{/* Data Section */}
							<div className="col-8">
							<div className="card-body d-flex flex-column h-100 p-3">
								<div className="d-flex justify-content-between align-items-start">
								<div>
									<h5 className="card-title fw-bold mb-0 text-truncate" style={{ maxWidth: '200px' }}>
									{item.year} {item.model}
									</h5>
									<span className="text-primary small fw-semibold text-uppercase ls-1">
									{item.type}
									</span>
								</div>
								<div className="text-end">
									<p className="h5 fw-bold text-success mb-0">OMR {item.price?.toLocaleString() || 'N/A'}</p>
									<small className="text-muted">Net Price</small>
								</div>
								</div>

								<div className="mt-2 py-2 border-top border-bottom border-light">
								<div className="row g-0 text-center">
									<div className="col-4 border-end">
									<small className="d-block text-muted text-uppercase smaller" style={{ fontSize: '10px' }}>Mileage</small>
									<span className="fw-bold small">{item.mileage || '0'} km</span>
									</div>
									<div className="col-4 border-end">
									<small className="d-block text-muted text-uppercase smaller" style={{ fontSize: '10px' }}>Color</small>
									<span className="fw-bold small text-capitalize">{item.color || 'White'}</span>
									</div>
									<div className="col-4">
									<small className="d-block text-muted text-uppercase smaller" style={{ fontSize: '10px' }}>Owner</small>
									<span className="fw-bold small">First</span>
									</div>
								</div>
								</div>

								{/* Actions Section */}
								<div className="d-flex gap-2 mt-auto pt-3">
								{/* VIEW BUTTON - Always visible to everyone */}
								<Link to={`/dashboard/items/editor`} className="btn btn-sm btn-outline-secondary w-100 d-flex align-items-center justify-content-center gap-1">
									<i className="bi bi-eye"></i> View
								</Link>

								{/* 🚀 CONDITIONAL RENDER: Only visible if the item belongs to the logged-in user */}
								{(isOwner || isAdmin) && (
									<>
									{/* DELETE BUTTON */}
									<button 
										onClick={() => handleDelete(item._id)}
										className="btn btn-sm btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-1"
									>
										<i className="bi bi-trash"></i> Delete
									</button>

									{/* EDIT BUTTON */}
									<Link to={`/dashboard/items/editor`} state={{ vehicle: item }} className="btn btn-sm btn-primary w-100 d-flex align-items-center justify-content-center gap-1">
										<i className="bi bi-pencil-square"></i> Edit
									</Link>
									</>
								)}
								</div>

							</div>
							</div>
						</div>

						{/* Attached User Profile Footer */}
						<div className="card-footer bg-light-subtle border-top border-light p-3 d-flex align-items-center gap-2">
							<div style={{ width: '32px', height: '32px' }} className="rounded-circle overflow-hidden shadow-sm bg-secondary-subtle d-flex align-items-center justify-content-center">
							<img 
								src={`http://localhost:3000/public/uploads/profiles/${profileImage}`}
								alt={displayName} 
								className="w-100 h-100 object-fit-cover"
								onError={(e) => {
								e.currentTarget.src = "http://localhost:3000/public/uploads/profiles/default.jpg";
								}}
							/>
							</div>
							<div className="d-flex flex-column">
							<span className="text-dark small fw-bold lh-sm">{displayName}</span>
							<span className="text-muted lh-1" style={{ fontSize: '10px' }}>
								Last Editor {matchedUser?.admin && <span className="badge bg-danger-subtle text-danger p-1 ms-1" style={{ fontSize: '8px' }}>Admin</span>}
							</span>
							</div>
						</div>

						</div>
					</div>
					);
				})
				)}
			</div>
		</div>

		{/* Styling for hover effect */}
		<style>{`
			.hover-shadow:hover { transform: translateY(-3px); transition: all 0.2s; box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important; }
			.smaller { font-size: 0.65rem; }
			.ls-1 { letter-spacing: 0.5px; }
		`}</style>

		</main>

      </div>
      </div>
    </>
  )
}

export default ItemsList;