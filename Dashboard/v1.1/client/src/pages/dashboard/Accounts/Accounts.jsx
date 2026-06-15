import {useState, useEffect} from "react"
import { Link } from "react-router-dom";

import Dash from "../../../components/dashboard/Dash.jsx"
import Nav from "../../../components/dashboard/Nav.jsx"

function Accounts() {
	const [users, setUsers] = useState([]);

	// Fetch all users on load
	useEffect(() => {
	fetchUsers();
	}, []);

	const fetchUsers = async () => {
	const res = await fetch("http://localhost:3000/api/accounts/user/users", { credentials: 'include' });
	const data = await res.json();
	setUsers(data);
	};

	const [selectedUser, setSelectedUser] = useState(null); // Tracks which user is being viewed
	const [editedEmail, setEditedEmail] = useState("");   // Tracks the email in the preview card

	// Function to handle the View Profile button click
	const handleViewProfile = (user) => {
		setSelectedUser(user);
		setEditedEmail(user.email);
	};

	// Function to update email from the card
	const handleCardEmailUpdate = async () => {
		try {
			const response = await fetch(`http://localhost:3000/api/admin/update-email/${selectedUser._id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email: editedEmail }),
				credentials: 'include'
			});

			if (response.ok) {
				alert("Email updated successfully!");
				// Update the local list so the table stays in sync
				setUsers(users.map(u => u._id === selectedUser._id ? { ...u, email: editedEmail } : u));
			}
		} catch (err) {
			console.error("Update failed", err);
		}
	};

	// Function for deleting exsisting accounts
	const handleDeleteUser = async (id, username) => {
	if (window.confirm(`Are you sure you want to delete ${username}?`)) {
		await fetch(`http://localhost:3000/api/accounts/admin/delete-user/${id}`, { 
			method: 'DELETE', 
			credentials: 'include' 
		});
		setUsers(users.filter(u => u._id !== id));
	}
	};

	// Function for registering new accounts
	const [loading, setLoading] = useState(false);
	const [showRegisterModal, setShowRegisterModal] = useState(false);
	const [newUser, setNewUser] = useState({
    	username: '', password: '', email: '', 
    	first_name: '', last_name: '', admin: false
	});

	// Function for registering users
	const handleRegisterSubmit = async (e) => {
		e.preventDefault();
		setLoading(true); // 1. Start the spinn

		try {
			const response = await fetch("http://localhost:3000/api/accounts/admin/register", {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(newUser),
				credentials: 'include'
			});

			const data = await response.json();
			if (response.ok) {
				alert("User registered successfully!");
				setShowRegisterModal(false); // Close modal
				setNewUser({ username: '', password: '', email: '', first_name: '', last_name: '', admin: false }); // Reset
				fetchUsers(); // Refresh your table list
			} else {
				alert(data.message);
			}
		} catch (err) {
			alert("Registration failed");
		} finally {
        	setLoading(false); // 2. Stop the spinner (happens whether success or error)
    	}
	};

	// Styles for the register a user pop up card
	const overlayStyle = {
		position: 'fixed',
		top: 0,
		left: 0,
		width: '100vw',
		height: '100vh',
		backgroundColor: 'rgba(0,0,0,0.5)',
		zIndex: 1050,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		padding: '20px'
	};

	const modalCardStyle = {
		width: '100%',
		maxWidth: '500px',
		borderRadius: '15px'
	}

  return (
	<>
	  <Dash />

	  <div class="container-fluid">
	  <div class="row">

		<Nav/>

		<main class="col-md-9 ms-sm-auto col-lg-10 px-md-4 bg-light min-vh-100">

			{/* Header Section: Amazon-style Breadcrumbs & Actions */}
			<div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-4 border-bottom">
				<div>
					
					<nav aria-label="breadcrumb">
						<ol className="breadcrumb mb-1">
						<li className="breadcrumb-item small text-muted">Accounts</li>
						<li className="breadcrumb-item small active" aria-current="page">Settings</li>
						</ol>
					</nav>

					<h1 className="h3 fw-bold text-dark">Manage Accounts</h1>
				</div>

					<div className="btn-toolbar mb-2 mb-md-0">
					<Link onClick={() => setShowRegisterModal(true)} className="btn btn-success shadow-sm">
						<i className="bi bi-person-plus-fill me-2"></i>+ Register New Usere
					</Link>
					</div>
			</div>

			{/* 2. The Popup Modal For registering users (Primary Blue Theme) */}
			{showRegisterModal && (
				<div className="modal-overlay" style={overlayStyle}>
					<div className="card shadow-lg border-0 animate__animated animate__zoomIn" style={modalCardStyle}>
						<div className="card-header bg-primary text-white d-flex justify-content-between align-items-center py-3">
							<h5 className="mb-0 fw-bold text-uppercase small">Create New Account</h5>
							<button type="button" className="btn-close btn-close-white" onClick={() => setShowRegisterModal(false)}></button>
						</div>
						<div className="card-body p-4">
							<form onSubmit={handleRegisterSubmit}>
								<div className="row g-3">
									<div className="col-md-6">
										<label className="form-label small fw-bold text-muted">First Name</label>
										<input type="text" className="form-control" required placeholder="John"
											onChange={(e) => setNewUser({...newUser, first_name: e.target.value})} />
									</div>
									<div className="col-md-6">
										<label className="form-label small fw-bold text-muted">Last Name</label>
										<input type="text" className="form-control" required placeholder="Doe"
											onChange={(e) => setNewUser({...newUser, last_name: e.target.value})} />
									</div>
									<div className="col-12">
										<label className="form-label small fw-bold text-muted">Email Address</label>
										<input type="email" className="form-control border-primary-subtle" required placeholder="john@nwstudios.com"
											onChange={(e) => setNewUser({...newUser, email: e.target.value})} />
									</div>
									<div className="col-md-6">
										<label className="form-label small fw-bold text-muted">Username</label>
										<input type="text" className="form-control" required placeholder="jdoe24"
											onChange={(e) => setNewUser({...newUser, username: e.target.value})} />
									</div>
									<div className="col-md-6">
										<label className="form-label small fw-bold text-muted">Initial Password</label>
										<input type="password" className="form-control" required placeholder="••••••••"
											onChange={(e) => setNewUser({...newUser, password: e.target.value})} />
									</div>
									<div className="col-12">
										<div className="form-check form-switch mt-2 p-3 bg-light rounded border border-primary-subtle">
											<input className="form-check-input ms-0 me-2" type="checkbox" id="adminSwitch"
												onChange={(e) => setNewUser({...newUser, admin: e.target.checked})} />
											<label className="form-check-label small fw-bold text-primary" htmlFor="adminSwitch">Assign Administrator Privileges</label>
										</div>
									</div>
								</div>
								
								<div className="d-grid gap-2 mt-4">
									<button type="submit" className="btn btn-primary py-2 fw-bold" disabled={loading}>
										{loading ? (
											<span className="spinner-border spinner-border-sm me-2"></span>
										) : "Register User"}
									</button>
									<button type="button" className="btn btn-link text-muted btn-sm text-decoration-none" onClick={() => setShowRegisterModal(false)}>
										Cancel
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			)}

			{/*Card to display info of selected users*/}
			{selectedUser && (
				<div className="card border-0 shadow-sm mb-4 animate__animated animate__fadeIn">
					<div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
						<h6 className="mb-0 fw-bold text-primary">User Detailed Profile</h6>
						<button type="button" className="btn-close" onClick={() => setSelectedUser(null)}></button>
					</div>
					<div className="card-body p-3 p-md-4"> {/* Added p-3 for mobile, p-md-4 for desktop */}
						{/* The main container row. Added g-4 for vertical gap when stacked */}
						<div className="row align-items-center g-4 g-md-0"> 
							
							{/* Left Side (Details) becomes Bottom on mobile */}
							{/* Changed from col-md-8 to col-12, col-md-8 */}
							<div className="col-12 col-md-8 order-2 order-md-1"> 
								<div className="row g-3">
									<div className="col-6">
										<label className="small text-muted">First Name</label>
										<p className="fw-bold mb-0">{selectedUser.first_name || 'N/A'}</p>
									</div>
									<div className="col-6">
										<label className="small text-muted">Last Name</label>
										<p className="fw-bold mb-0">{selectedUser.last_name || 'N/A'}</p>
									</div>
									<div className="col-12 col-sm-6"> {/* Combined username/text secondary on mobile */}
										<label className="small text-muted">Username</label>
										<p className="fw-bold text-secondary mb-0">@{selectedUser.username}</p>
									</div>
									<div className="col-12">
										<label className="small text-muted">Email Address</label>
										{/* Input group - changed w-75 to w-100 for mobile, w-md-75 for desktop */}
										<div className="input-group w-100 w-md-75">
											<input 
												type="email" 
												className="form-control" 
												value={editedEmail} 
												onChange={(e) => setEditedEmail(e.target.value)} 
											/>
											<button className="btn btn-primary" onClick={handleCardEmailUpdate}>Update</button>
										</div>
									</div>
								</div>
							</div>

							{/* Right Side (Image/Status) becomes Top on mobile */}
							{/* Changed from col-md-4 to col-12, col-md-4 */}
							{/* Also removed border-start which looked bad on mobile */}
							<div className="col-12 col-md-4 text-center order-1 order-md-2 border-md-start"> 
								<img 
									src={`http://localhost:3000/public/uploads/profiles/${selectedUser.profile_img}`} 
									className="rounded-circle img-thumbnail shadow-sm mb-3 mb-md-2" /* Adjusted margin */
									style={{ width: '120px', height: '120px', objectFit: 'cover' }} 
									alt="Profile"
								/>
							<div className="mt-2">
								{selectedUser.admin && <span className="badge bg-danger me-1">Admin</span>}
								{selectedUser.technician && <span className="badge bg-info me-1">Technician</span>}
								
								{/* Only shows if they are neither an Admin nor a Technician */}
								{!selectedUser.admin && !selectedUser.technician && (
									<span className="badge bg-primary">Editor</span>
								)}
							</div>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* User List Table */}
			<div class="card border-0 shadow-sm">
				<div class="table-responsive">
					<table class="table table-hover align-middle mb-0">
						<thead class="bg-light text-muted small text-uppercase">
							<tr>
								<th>User</th>
								<th>Role</th>
								<th class="text-end">Actions</th>
							</tr>
						</thead>
						<tbody>
							{users.map((user) => (
								<tr key={user._id}>
									<td>
										<div class="d-flex align-items-center">
											<img src={`http://localhost:3000/public/uploads/profiles/${user.profile_img}`} class="rounded-circle me-3" width="35" height="35" style={{objectFit: 'cover'}} />
											<span class="fw-bold text-dark">{user.username}</span>
										</div>
									</td>
									<td>
										<div>
											{user.admin && <span className="badge bg-danger me-1">Admin</span>}
											
											{/* Only shows if they are neither an Admin nor a Technician */}
											{!user.admin && (
												<span className="badge bg-primary">Editor</span>
											)}
										</div>
									</td>
									<td class="text-end">
										<button 
											class="btn btn-sm btn-outline-primary me-2" 
											onClick={() => handleViewProfile(user)}
										>
											View Profile
										</button>
										{!user.admin && (
										<button 
											class="btn btn-sm btn-outline-danger" 
											onClick={() => handleDeleteUser(user._id, user.username)}
										>
											Delete
										</button>
										)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</main>

	  </div>
	  </div>
	</>
  )
}

export default Accounts;