import {useState, useEffect} from "react"
import { Link } from 'react-router-dom';

import Dash from "../../../components/dashboard/Dash.jsx"
import Nav from "../../../components/dashboard/Nav.jsx"

function Log() {
	// For collecting the LOGS via backend API
	const [logs, setLogs] = useState([]);

	useEffect(() => {
		fetch('http://localhost:3000/api/user/logs/logs')
			.then(res => res.json())
			.then(data => setLogs(data))
			.catch(err => console.error("Error fetching logs:", err));
	}, []);

  return (
	<>
	  <Dash />

	  <div class="container-fluid">
	  <div class="row">

		<Nav />

		<main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 bg-light min-vh-100">
			<div className="container py-5">
				{/* Header Section */}
				<div className="mb-4">
					<h1 className="h3 fw-bold text-dark">Logs</h1>
					<p className="text-muted">All changes that are done to the site is traced here for better readability</p>
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