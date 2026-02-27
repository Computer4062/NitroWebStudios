import {useState, useEffect} from "react"
import { useNavigate } from "react-router-dom";

import Dash from "../../../components/Dashboard/Dash.jsx"
import Nav from "../../../components/Dashboard/Nav.jsx"

function Accounts() {
	const [users, setUsers] = useState([]);

	// Fetch all users on load
	useEffect(() => {
	fetchUsers();
	}, []);

	const fetchUsers = async () => {
	const res = await fetch("http://localhost:3000/api/accounts/users", { credentials: 'include' });
	const data = await res.json();
	setUsers(data);
	};

	const handleEmailUpdate = async (id, newEmail) => {
	await fetch(`http://localhost:3000/api/accounts/update-email/${id}`, {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ email: newEmail }),
		credentials: 'include'
	});
	alert("Email updated!");
	};

	const handleDeleteUser = async (id, username) => {
	if (window.confirm(`Are you sure you want to delete ${username}?`)) {
		await fetch(`http://localhost:3000/api/accounts/delete-user/${id}`, { 
			method: 'DELETE', 
			credentials: 'include' 
		});
		setUsers(users.filter(u => u._id !== id));
	}
	};

  return (
	<>
	  <Dash />

	  <div class="container-fluid">
	  <div class="row">

		<Nav/>

		<main class="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-4">
			<div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-4 border-bottom">
				<h1 class="h2">Account Management</h1>
				<button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#registerModal">
				+ Register New User
				</button>
			</div>

			{/* User List Table */}
			<div class="card border-0 shadow-sm">
				<div class="table-responsive">
				<table class="table table-hover align-middle mb-0">
					<thead class="bg-light">
					<tr>
						<th>User</th>
						<th>Email</th>
						<th>Role</th>
						<th class="text-end">Actions</th>
					</tr>
					</thead>
					<tbody>
					{users.map((user) => (
						<tr key={user._id}>
						<td>
							<div class="d-flex align-items-center">
							<img src={`http://localhost:3000/public/images/profiles/${user.profile_img}`} class="rounded-circle me-2" width="30" height="30" style={{objectFit: 'cover'}} />
							<span class="fw-bold">{user.username}</span>
							</div>
						</td>
						<td>
							<input 
							type="email" 
							class="form-control form-control-sm w-75" 
							defaultValue={user.email} 
							onBlur={(e) => handleEmailUpdate(user._id, e.target.value)}
							/>
						</td>
						<td>
							<span class={`badge ${user.admin ? 'bg-danger' : 'bg-primary'}`}>
							{user.admin ? 'Admin' : 'Editor'}
							</span>
						</td>
						<td class="text-end">
							<button 
							class="btn btn-outline-danger btn-sm" 
							onClick={() => handleDeleteUser(user._id, user.username)}
							>
							Delete
							</button>
						</td>
						</tr>
					))}
					</tbody>
				</table>
				</div>
			</div>

			{/* Simplified Registration Modal Component Placeholder */}
			{/* You would insert your existing Register Form logic here inside a Bootstrap Modal */}
		</main>

	  </div>
	  </div>
	</>
  )
}

export default Accounts;