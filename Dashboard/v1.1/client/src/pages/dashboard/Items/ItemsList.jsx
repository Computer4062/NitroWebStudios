import {useState, useEffect} from "react"
import { useNavigate, Link } from "react-router-dom";

import Dash from "../../../components/dashboard/Dash.jsx"
import Nav from "../../../components/dashboard/Nav.jsx"

// -----------------------------------------------------------------------
// FILTER OPTIONS
// Body Type reuses your existing `item.type` field, so it works out of the
// box. Brand / Drive Type / Special Collections assume `item.brand`,
// `item.driveType`, and `item.collections` (an array of strings) exist on
// your item objects. If your API uses different field names, just update
// the three spots marked "ASSUMED FIELD" below in `displayedItems`.
// -----------------------------------------------------------------------
const BRAND_OPTIONS = [
	"Ferrari", "Lamborghini", "Rolls-Royce", "Bentley", "Porsche",
	"Mercedes-Benz", "Aston Martin", "McLaren", "Bugatti", "Koenigsegg",
	"Maybach", "Brabus", "BMW", "Audi", "Land Rover", "Lexus",
	"Novitec", "Mansory", "Dodge", "Ford"
];

const BODY_TYPE_OPTIONS = ["Coupe", "SUV", "Convertible", "Sedan", "Roadster", "Van / MPV"];

const DRIVE_TYPE_OPTIONS = [
	"Combustion Engine — Petrol",
	"Combustion Engine — Diesel",
	"Plugin Hybrid",
	"Full Electric"
];

const COLLECTION_OPTIONS = ["Armoured", "Customized", "Electric", "Classic"];

const PRICE_MIN = 18000;
const PRICE_MAX = 3000000;

const defaultFilters = {
	brands: [],
	bodyTypes: [],
	driveTypes: [],
	collections: [],
	priceMin: PRICE_MIN,
	priceMax: PRICE_MAX,
};

function ItemsList() {
  const navigate = useNavigate();

	// Fetch the items from the database

	const [items, setItems] = useState([]);
	const [users, setUsers] = useState([]); // Raw fetched user profiles
	const [searchQuery, setSearchQuery] = useState(""); // for search string
	const [currentUser, setCurrentUser] = useState(null); // Stores the logged-in user object
	const [isAdmin, setIsAdmin] = useState();

	// --- FILTER STATE ---
	const [filters, setFilters] = useState(defaultFilters);
	const [showFilters, setShowFilters] = useState(false); // controls the mobile drawer

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

	// --- FILTER HELPERS ---
	const toggleFilterValue = (key, value) => {
		setFilters(prev => {
			const current = new Set(prev[key]);
			if (current.has(value)) {
				current.delete(value);
			} else {
				current.add(value);
			}
			return { ...prev, [key]: Array.from(current) };
		});
	};

	const handlePriceMinChange = (value) => {
		setFilters(prev => ({ ...prev, priceMin: Math.min(value, prev.priceMax) }));
	};

	const handlePriceMaxChange = (value) => {
		setFilters(prev => ({ ...prev, priceMax: Math.max(value, prev.priceMin) }));
	};

	const resetFilters = () => setFilters(defaultFilters);

	const activeFilterCount =
		filters.brands.length +
		filters.bodyTypes.length +
		filters.driveTypes.length +
		filters.collections.length +
		(filters.priceMin !== PRICE_MIN || filters.priceMax !== PRICE_MAX ? 1 : 0);

	// Display items as per search + filters
  const displayedItems = items.filter((item) => {
	const query = searchQuery.toLowerCase();

	// Check if query exsists in model, year, or type
	const matchesSearch = (
		item.model?.toLowerCase().includes(query) ||
		item.year?.toString().includes(query) ||
		item.type?.toLowerCase().includes(query) ||
		item.user?.toLowerCase().includes(query)
	);
	if (!matchesSearch) return false;

	// Brand filter — ASSUMED FIELD: item.brand
	if (filters.brands.length && !filters.brands.includes(item.brand)) return false;

	// Body type filter — reuses the existing item.type field
	if (filters.bodyTypes.length && !filters.bodyTypes.includes(item.type)) return false;

	// Drive type filter — ASSUMED FIELD: item.driveType
	if (filters.driveTypes.length && !filters.driveTypes.includes(item.driveType)) return false;

	// Special collections filter — ASSUMED FIELD: item.collections (array of strings)
	if (filters.collections.length) {
		const itemCollections = item.collections || [];
		const hasMatch = filters.collections.some(c => itemCollections.includes(c));
		if (!hasMatch) return false;
	}

	// Price range filter
	const price = item.price ?? 0;
	if (price < filters.priceMin || price > filters.priceMax) return false;

	return true;
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

      <div className="container-fluid">
      <div className="row">
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

		{/* Search & Filter Bar */}
		<div className="card border-0 shadow-sm mb-4">
			<div className="card-body p-3">
			<div className="row g-2 align-items-center">
				<div className="col-12 col-md-9">
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
				<div className="col-12 col-md-3">
				<button
					type="button"
					className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center gap-2"
					onClick={() => setShowFilters(true)}
				>
					<i className="bi bi-sliders"></i>
					Filters
					{activeFilterCount > 0 && (
						<span className="badge rounded-pill bg-primary">{activeFilterCount}</span>
					)}
				</button>
				</div>
			</div>
			</div>
		</div>

		{/* Body: Filter Sidebar + Inventory Grid */}
		<div className="row g-3">

			{/* Desktop Filter Sidebar (hidden below lg) */}
			<div className="col-lg-3 d-none d-lg-block">
				<div style={{ position: 'sticky', top: '1rem' }}>
					<FilterPanelContent
						filters={filters}
						toggleFilterValue={toggleFilterValue}
						onPriceMinChange={handlePriceMinChange}
						onPriceMaxChange={handlePriceMaxChange}
						resetFilters={resetFilters}
					/>
				</div>
			</div>

			{/* Mobile Filter Drawer */}
			{showFilters && (
				<>
					<div className="filter-backdrop d-lg-none" onClick={() => setShowFilters(false)}></div>
					<div className="filter-drawer d-lg-none">
						<div className="d-flex justify-content-between align-items-center mb-3">
							<h5 className="mb-0 fw-bold">Filters</h5>
							<button
								type="button"
								className="btn-close"
								aria-label="Close"
								onClick={() => setShowFilters(false)}
							></button>
						</div>

						<FilterPanelContent
							filters={filters}
							toggleFilterValue={toggleFilterValue}
							onPriceMinChange={handlePriceMinChange}
							onPriceMaxChange={handlePriceMaxChange}
							resetFilters={resetFilters}
							flush
						/>

						<button
							type="button"
							className="btn btn-primary w-100 mt-3"
							onClick={() => setShowFilters(false)}
						>
							Show {displayedItems.length} {displayedItems.length === 1 ? "result" : "results"}
						</button>
					</div>
				</>
			)}

			{/* Inventory Grid */}
			<div className="col-lg-9">
				<div className="row g-3">
				{displayedItems.length === 0 ? (
					<div className="col-12 text-center text-muted py-5">
						<h5>No inventory items found.</h5>
						{activeFilterCount > 0 && (
							<button type="button" className="btn btn-link" onClick={resetFilters}>
								Clear filters
							</button>
						)}
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
									src={`http://localhost:3000/public${item.images ? item.images : ''}`}
									
									className="object-fit-cover w-100" 
									alt={item.model || 'Vehicle'}
									
									style={{ 
										height: '220px',       // Forces every single card image to be exactly this height
										objectPosition: 'center' // Guarantees the crop happens perfectly from the dead center
									}}
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
								<span className="text-dark small fw-bold lh-sm">{item.user}</span>
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

		</div>

		</main>

      </div>
      </div>

		{/* Styling */}
		<style>{`
			.hover-shadow:hover { transform: translateY(-3px); transition: all 0.2s; box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important; }
			.smaller { font-size: 0.65rem; }
			.ls-1 { letter-spacing: 0.5px; }

			/* --- Filter drawer (mobile) --- */
			.filter-backdrop {
				position: fixed;
				inset: 0;
				background: rgba(0, 0, 0, 0.5);
				z-index: 1040;
			}
			.filter-drawer {
				position: fixed;
				top: 0;
				right: 0;
				bottom: 0;
				width: 88%;
				max-width: 360px;
				background: #fff;
				z-index: 1050;
				padding: 1.25rem;
				overflow-y: auto;
				box-shadow: -6px 0 24px rgba(0, 0, 0, 0.15);
				animation: filterSlideIn 0.25s ease-out;
			}
			@keyframes filterSlideIn {
				from { transform: translateX(100%); }
				to { transform: translateX(0); }
			}

			/* --- Dual price range slider --- */
			.range-slider { position: relative; height: 22px; }
			.range-track {
				position: absolute;
				top: 9px; left: 0; right: 0;
				height: 4px;
				background: #dee2e6;
				border-radius: 2px;
			}
			.range-fill {
				position: absolute;
				top: 9px;
				height: 4px;
				background: #0d6efd;
				border-radius: 2px;
			}
			.range-input {
				position: absolute;
				top: 0; left: 0;
				width: 100%;
				height: 22px;
				margin: 0;
				appearance: none;
				-webkit-appearance: none;
				background: transparent;
				pointer-events: none;
			}
			.range-input::-webkit-slider-thumb {
				pointer-events: auto;
				appearance: none;
				-webkit-appearance: none;
				width: 16px; height: 16px;
				border-radius: 50%;
				background: #fff;
				border: 2px solid #0d6efd;
				cursor: pointer;
				margin-top: 0;
			}
			.range-input::-moz-range-thumb {
				pointer-events: auto;
				width: 16px; height: 16px;
				border-radius: 50%;
				background: #fff;
				border: 2px solid #0d6efd;
				cursor: pointer;
			}
			.range-input::-moz-range-track { background: transparent; }
		`}</style>
    </>
  )
}

// -----------------------------------------------------------------------
// Filter panel — shared between the desktop sidebar and the mobile drawer
// -----------------------------------------------------------------------
function FilterPanelContent({ filters, toggleFilterValue, onPriceMinChange, onPriceMaxChange, resetFilters, flush }) {
	const leftPct = ((filters.priceMin - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;
	const rightPct = 100 - ((filters.priceMax - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;

	const content = (
		<>
			<div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
				<h6 className="mb-0 fw-bold text-uppercase small">Filters</h6>
				<button type="button" className="btn btn-link btn-sm text-decoration-none p-0" onClick={resetFilters}>
					Reset
				</button>
			</div>

			<FilterSection title="Brand">
				<div style={{ maxHeight: '180px', overflowY: 'auto' }}>
					{BRAND_OPTIONS.map((brand) => (
						<div className="form-check" key={brand}>
							<input
								className="form-check-input"
								type="checkbox"
								id={`brand-${brand}`}
								checked={filters.brands.includes(brand)}
								onChange={() => toggleFilterValue('brands', brand)}
							/>
							<label className="form-check-label small" htmlFor={`brand-${brand}`}>{brand}</label>
						</div>
					))}
				</div>
			</FilterSection>

			<FilterSection title="Body Type">
				{BODY_TYPE_OPTIONS.map((bodyType) => (
					<div className="form-check" key={bodyType}>
						<input
							className="form-check-input"
							type="checkbox"
							id={`body-${bodyType}`}
							checked={filters.bodyTypes.includes(bodyType)}
							onChange={() => toggleFilterValue('bodyTypes', bodyType)}
						/>
						<label className="form-check-label small" htmlFor={`body-${bodyType}`}>{bodyType}</label>
					</div>
				))}
			</FilterSection>

			<FilterSection title="Drive Type">
				{DRIVE_TYPE_OPTIONS.map((driveType) => (
					<div className="form-check" key={driveType}>
						<input
							className="form-check-input"
							type="checkbox"
							id={`drive-${driveType}`}
							checked={filters.driveTypes.includes(driveType)}
							onChange={() => toggleFilterValue('driveTypes', driveType)}
						/>
						<label className="form-check-label small" htmlFor={`drive-${driveType}`}>{driveType}</label>
					</div>
				))}
			</FilterSection>

			<FilterSection title="Price Range">
				<div className="d-flex justify-content-between small text-muted mb-2">
					<span>OMR {Number(filters.priceMin).toLocaleString()}</span>
					<span>OMR {Number(filters.priceMax).toLocaleString()}</span>
				</div>

				<div className="range-slider mb-3">
					<div className="range-track"></div>
					<div className="range-fill" style={{ left: `${leftPct}%`, right: `${rightPct}%` }}></div>
					<input
						type="range"
						min={PRICE_MIN}
						max={PRICE_MAX}
						step="1000"
						value={filters.priceMin}
						onChange={(e) => onPriceMinChange(Number(e.target.value))}
						className="range-input"
					/>
					<input
						type="range"
						min={PRICE_MIN}
						max={PRICE_MAX}
						step="1000"
						value={filters.priceMax}
						onChange={(e) => onPriceMaxChange(Number(e.target.value))}
						className="range-input"
					/>
				</div>

				<div className="row g-2">
					<div className="col-6">
						<label className="form-label small text-muted mb-1">Min</label>
						<input
							type="number"
							className="form-control form-control-sm"
							value={filters.priceMin}
							onChange={(e) => onPriceMinChange(Number(e.target.value) || PRICE_MIN)}
						/>
					</div>
					<div className="col-6">
						<label className="form-label small text-muted mb-1">Max</label>
						<input
							type="number"
							className="form-control form-control-sm"
							value={filters.priceMax}
							onChange={(e) => onPriceMaxChange(Number(e.target.value) || PRICE_MAX)}
						/>
					</div>
				</div>
			</FilterSection>

			<FilterSection title="Special Collections" last>
				{COLLECTION_OPTIONS.map((collection) => (
					<div className="form-check" key={collection}>
						<input
							className="form-check-input"
							type="checkbox"
							id={`collection-${collection}`}
							checked={filters.collections.includes(collection)}
							onChange={() => toggleFilterValue('collections', collection)}
						/>
						<label className="form-check-label small" htmlFor={`collection-${collection}`}>{collection}</label>
					</div>
				))}
			</FilterSection>
		</>
	);

	if (flush) {
		return <div>{content}</div>;
	}

	return <div className="card border-0 shadow-sm p-3">{content}</div>;
}

function FilterSection({ title, children, last }) {
	return (
		<div className={last ? "mb-0" : "mb-4"}>
			<h6 className="small fw-semibold text-uppercase text-muted mb-2">{title}</h6>
			{children}
		</div>
	);
}

export default ItemsList;
