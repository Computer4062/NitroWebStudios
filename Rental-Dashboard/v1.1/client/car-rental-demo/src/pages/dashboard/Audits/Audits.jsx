import { useState, useEffect } from "react"
import { Link } from 'react-router-dom';
import api from "../../../api.jsx"

import Dash from "../../../components/dashboard/Dash.jsx"
import Nav from "../../../components/dashboard/Nav.jsx"

function Log() {
	// For checking if user is an admin
	const [isAdmin, setIsAdmin] = useState(false);

	useEffect(() => {
		const checkUserAuth = async () => {
			try {
				const response = await api.get("/api/accounts/check-auth", {
					withCredentials: true
				});

				setIsAdmin(response.data.admin);

			} catch (error) {
				console.log(error)
			}
		}

		checkUserAuth();
	}, []);


	// For collecting the LOGS via backend API
	const [logs, setLogs] = useState([]);

	useEffect(() => {
		api.get('/api/logs/user/logs', {
			withCredentials: true
		})
			.then(res => setLogs(res.data))
			.catch(err => console.error("Error fetching logs:", err));
	}, []);


	// For clearing log entries
	const [logEntries, setLogEntries] = useState(""); // Assuming you use a state like this to hold log text

	const handleClearLogs = async () => {
		// 1. Prevent accidental wipes with an urgent confirmation pop-up
		const confirmWipe = window.confirm(
			"CRITICAL WARNING:\n\nAre you sure you want to permanently clear all system activity logs? This action cannot be undone."
		);

		if (!confirmWipe) return;

		try {
			// 2. Fire the DELETE request to your live API endpoint
			const response = await api.delete("/api/logs/admin/clear-logs", {
				withCredentials: true
			});

			// 3. Inform the admin of a successful clean
			alert(`Success: ${response.data.message || "System logs cleared."}`);

			// 4. Update frontend UI state instantly so the text screen resets
			const timestamp = new Date().toISOString();
			setLogEntries(`[${timestamp}] INFO: Log file cleared by Administrator.\n`);

		} catch (error) {
			if (error.response) {
				// Handles permission failures (e.g., 401 Unauthorized or 403 Forbidden)
				alert(`Authorization Error: ${error.response.data?.message || "You do not have permission to clear logs."}`);
			} else {
				console.error("Network fault while attempting to clear telemetry logs:", error);
				alert("Network Error: Could not connect to the remote administration server.");
			}
		}
	};

  return (
	<>
	  <Dash />

	  <div className="container-fluid">
	  <div className="row">

		<Nav />

		<main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 bg-light min-vh-100">
			<div className="container py-5">
				{/* Header Section */}
				<div className="row align-items-center justify-content-between gy-3 mb-4">
					
					{/* Text Content Section */}
					<div className="col-12 col-md-8 text-start">
					<h1 className="h3 fw-bold text-dark mb-1">Logs</h1>
					<p className="text-muted mb-0">
						All changes that are done to the site is traced here for better readability
					</p>
					</div>

					{/* Button Wrapper Section */}
					{isAdmin && (
					<div className="col-12 col-md-4 d-flex justify-content-start justify-content-md-end">
					<button 
						onClick={handleClearLogs} 
						className="btn btn-outline-danger d-flex align-items-center justify-content-center gap-2 w-100 w-md-auto py-2 px-3"
					>
						<i className="bi bi-trash3"></i>
						<span>Clear System Logs</span>
					</button>
					</div>
					)}

				</div>

				{/* LOGS TABLE */}
				<div className="card shadow-sm border-0">
					<div className="card-body p-0">
						<div className="table-responsive">
							<table className="table table-hover mb-0">
								<thead className="table-dark">
									<tr>
										<th className="ps-4">Action</th>
										<th>User</th>
										<th className="text-end pe-4">Date & Time</th>
									</tr>
								</thead>
								<tbody>
									{logs.length > 0 ? (
										logs.map((log, index) => (
											<tr key={index}>
												<td className="ps-4">
													<span className={`badge ${
														log.action.includes('ADD') ? 'bg-success' : 
														log.action.includes('DELETE') ? 'bg-danger' : 'bg-primary'
													}`}>
														{log.action}
													</span>
												</td>
												<td className="text-secondary fw-semibold">{log.user}</td>
												<td className="text-end text-muted pe-4">{log.dateTime}</td>
											</tr>
										))
									) : (
										<tr>
											<td colSpan="3" className="text-center py-4 text-muted">No activity logs found.</td>
										</tr>
									)}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</main>

	  </div>
	  </div>
	</>
  )
}

export default Log;