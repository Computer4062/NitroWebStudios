import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom";

import Dash from "../../../components/dashboard/Dash.jsx"
import Nav from "../../../components/dashboard/Nav.jsx"
import api from "../../../api.jsx"

const base_url = "http://localhost:3000";

const BRAND_OPTIONS = [
	"Ferrari", "Lamborghini", "Rolls-Royce", "Bentley", "Porsche",
	"Mercedes-Benz", "Aston Martin", "McLaren", "Bugatti", "Koenigsegg",
	"Maybach", "Brabus", "BMW", "Audi", "Land Rover", "Lexus",
	"Novitec", "Mansory", "Dodge", "Ford"
];

const BODY_TYPE_OPTIONS = ["Coupe", "SUV", "Convertible", "Sedan", "Roadster", "Van / MPV"];
const FUEL_TYPE_OPTIONS = ["Electric", "Petrol/Diesel"];

const STATUS_OPTIONS = [
	{ value: "all", label: "All" },
	{ value: "Available", label: "Available" },
	{ value: "Rented", label: "Rented" },
	{ value: "Draft", label: "Drafts" },
];

const PRICE_MIN = 0;
const PRICE_MAX = 500;

const defaultFilters = {
	brands: [],
	bodyTypes: [],
	fuelTypes: [],
	status: "all",
	priceMin: PRICE_MIN,
	priceMax: PRICE_MAX,
};

function MyPosts() {
  const navigate = useNavigate();

	const [items, setItems] = useState([]);
	const [users, setUsers] = useState([]); // Raw fetched user profiles
	const [searchQuery, setSearchQuery] = useState(""); // for search string
	const [currentUser, setCurrentUser] = useState(null); // Stores the logged-in user's username

	// --- FILTER STATE ---
	const [filters, setFilters] = useState(defaultFilters);
	const [showFilters, setShowFilters] = useState(false); // controls the mobile drawer

  // Fetch BOTH published and drafted vehicles, tagging drafts so the UI can
  // show a "Draft" badge and the status filter can distinguish them
  useEffect(() => {
    const fetchAllItems = async () => {
      try {
        const [publishedRes, draftsRes] = await Promise.all([
          api.get('/api/stocks/all'),
          api.get('/api/stocks/user/drafts', { withCredentials: true })
        ]);

        const published = publishedRes.data.map(item => ({ ...item, isDraft: false }));
        const drafts = draftsRes.data.map(item => ({ ...item, isDraft: true }));

        setItems([...published, ...drafts]);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchAllItems();
  }, []);

  // --- 2. FETCHING LOGIC ---
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // A. Verify active authentication and get current logged-in user details
        try {
          const authRes = await api.get("/api/accounts/check-username", {
            withCredentials: true
          });
          setCurrentUser(authRes.data.name);
        } catch (authError) {
          if (authError.response?.status === 401) {
            console.warn("User is unauthorized.");
            // Optional: navigate("/login") if you want a hard boot to login page
          } else {
            throw authError;
          }
        }

        // B. Fetch all registered user profiles (for the card footers)
        const usersRes = await api.get("/api/accounts/user/users", {
          withCredentials: true
        });
        setUsers(usersRes.data);

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
		filters.fuelTypes.length +
		(filters.status !== "all" ? 1 : 0) +
		(filters.priceMin !== PRICE_MIN || filters.priceMax !== PRICE_MAX ? 1 : 0);

	// Display items as per search + filters
  const displayedItems = items.filter((item) => {
	const query = searchQuery.toLowerCase();

	const matchesSearch = (
		item.name?.toLowerCase().includes(query) ||
		item.brand?.toLowerCase().includes(query) ||
		item.type?.toLowerCase().includes(query)
	);
	if (!matchesSearch) return false;

	// Ownership filter — only show listings belonging to the logged-in user.
	// NOTE: requires a `user` column on `vehicles` (see message above).
	if (item.user !== currentUser) return false;

	// Brand filter
	if (filters.brands.length && !filters.brands.includes(item.brand)) return false;

	// Body type filter — reuses item.type
	if (filters.bodyTypes.length && !filters.bodyTypes.includes(item.type)) return false;

	// Fuel type filter
	if (filters.fuelTypes.length && !filters.fuelTypes.includes(item.fuel_type)) return false;

	// Status filter (includes a synthetic "Draft" bucket)
	if (filters.status !== "all") {
		if (filters.status === "Draft") {
			if (!item.isDraft) return false;
		} else {
			if (item.isDraft || item.status !== filters.status) return false;
		}
	}

	// Price range filter
	const price = item.price ?? 0;
	if (price < filters.priceMin || price > filters.priceMax) return false;

	return true;
  });

  	// Function for handling the deletion of listings
	const handleDelete = async (id) => {
		const confirmDelete = window.confirm("Are you sure you want to delete this listing?");
		if (!confirmDelete) return;

		try {
			const response = await api.delete(`/api/stocks/user/delete/${id}`, {
				withCredentials: true
			});

			if (response.status === 200) {
				alert("Deleted successfully!");
				setItems(prevItems => prevItems.filter(item => item.id !== id));
			} else {
				alert("Failed to delete.");
			}
		} catch (error) {
			console.error("Delete error:", error);
			alert("Failed to delete.");
		}
	};

	  return (
    <>
		<Dash />

      <div className="container-fluid">
      <div className="row">
	  	<Nav />

		<main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 bg-light min-vh-100">

		{/* Header Section */}
		<div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-4 border-bottom">
			<div>
			<nav aria-label="breadcrumb">
				<ol className="breadcrumb mb-1">
				<li className="breadcrumb-item small text-muted">Dashboard</li>
				<li className="breadcrumb-item small active" aria-current="page">My Listings</li>
				</ol>
			</nav>
			<h1 className="h3 fw-bold text-dark">My Listings</h1>
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
					placeholder="Search by name, brand, or type..." 
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

			{/* Desktop Filter Sidebar */}
			<div className="col-lg-3 d-none d-lg-block">
				<div style={{ position: 'sticky', top: '1rem' }}>
					<FilterPanelContent
						filters={filters}
						setFilters={setFilters}
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
							setFilters={setFilters}
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
						<h5>No listings found.</h5>
						{activeFilterCount > 0 && (
							<button type="button" className="btn btn-link" onClick={resetFilters}>
								Clear filters
							</button>
						)}
					</div>
					) : (
					displayedItems.map((item) => {
						const matchedUser = users.find(u => u.id === item.user || u.username === item.user);
						const profileImage = matchedUser?.profile_img ? matchedUser.profile_img : 'default.jpg';
						const displayName = matchedUser
						? `${matchedUser.first_name} ${matchedUser.last_name}`
						: (item.user || 'Unknown User');

						return (
						<div className="col-12 col-xl-6" key={item.id}>
							<div className="card border-0 shadow-sm h-100 hover-shadow transition d-flex flex-column overflow-hidden">
							<div className="row g-0 flex-grow-1">
								
								{/* Image Section */}
								<div className="col-4 position-relative">
									<img
									src={`${base_url}/public${item.img && item.img[0] ? item.img[0] : ''}`}
									className="object-fit-cover w-100" 
									alt={item.name || 'Vehicle'}
									style={{ 
										height: '220px',
										objectPosition: 'center'
									}}
									/>
									{item.isDraft && (
										<span className="badge bg-secondary position-absolute top-0 start-0 m-2">Draft</span>
									)}
								</div>

								{/* Data Section */}
								<div className="col-8">
								<div className="card-body d-flex flex-column h-100 p-3">
									<div className="d-flex justify-content-between align-items-start">
									<div>
										<h5 className="card-title fw-bold mb-0 text-truncate" style={{ maxWidth: '200px' }}>
										{item.name}
										</h5>
										<span className="text-primary small fw-semibold text-uppercase ls-1">
										{item.type}
										</span>
									</div>
									<div className="text-end">
										<p className="h5 fw-bold text-success mb-0">OMR {item.price?.toLocaleString() || 'N/A'}</p>
										<small className="text-muted">Per day</small>
									</div>
									</div>

									<div className="mt-2 py-2 border-top border-bottom border-light">
									<div className="row g-0 text-center">
										<div className="col-4 border-end">
										<small className="d-block text-muted text-uppercase smaller" style={{ fontSize: '10px' }}>Fuel Type</small>
										<span className="fw-bold small">{item.fuel_type || 'N/A'}</span>
										</div>
										<div className="col-4 border-end">
										<small className="d-block text-muted text-uppercase smaller" style={{ fontSize: '10px' }}>Seats</small>
										<span className="fw-bold small">{item.seats || 'N/A'}</span>
										</div>
										<div className="col-4">
										<small className="d-block text-muted text-uppercase smaller" style={{ fontSize: '10px' }}>Gearbox</small>
										<span className="fw-bold small">{item.gearbox || 'N/A'}</span>
										</div>
									</div>
									</div>

									{/* Actions Section — always shown since this page already only lists the current user's items */}
									<div className="d-flex gap-2 mt-auto pt-3">
									<Link to={`/dashboard/items/editor`} className="btn btn-sm btn-outline-secondary w-100 d-flex align-items-center justify-content-center gap-1">
										<i className="bi bi-eye"></i> View
									</Link>

									<button 
										onClick={() => handleDelete(item.id)}
										className="btn btn-sm btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-1"
									>
										<i className="bi bi-trash"></i> Delete
									</button>

									<Link to={`/dashboard/items/editor`} state={{ vehicle: item }} className="btn btn-sm btn-primary w-100 d-flex align-items-center justify-content-center gap-1">
										<i className="bi bi-pencil-square"></i> Edit
									</Link>
									</div>

								</div>
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
function FilterPanelContent({ filters, setFilters, toggleFilterValue, onPriceMinChange, onPriceMaxChange, resetFilters, flush }) {
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

			<FilterSection title="Fuel Type">
				{FUEL_TYPE_OPTIONS.map((fuelType) => (
					<div className="form-check" key={fuelType}>
						<input
							className="form-check-input"
							type="checkbox"
							id={`fuel-${fuelType}`}
							checked={filters.fuelTypes.includes(fuelType)}
							onChange={() => toggleFilterValue('fuelTypes', fuelType)}
						/>
						<label className="form-check-label small" htmlFor={`fuel-${fuelType}`}>{fuelType}</label>
					</div>
				))}
			</FilterSection>

			<FilterSection title="Status">
				{STATUS_OPTIONS.map((opt) => (
					<div className="form-check" key={opt.value}>
						<input
							className="form-check-input"
							type="radio"
							name="status"
							id={`status-${opt.value}`}
							checked={filters.status === opt.value}
							onChange={() => setFilters(prev => ({ ...prev, status: opt.value }))}
						/>
						<label className="form-check-label small" htmlFor={`status-${opt.value}`}>{opt.label}</label>
					</div>
				))}
			</FilterSection>

			<FilterSection title="Price Range" last>
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

export default MyPosts;