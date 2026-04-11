import {useState, useEffect} from "react"
import { Link } from 'react-router-dom';

import Dash from "../../../components/Dashboard/Dash.jsx"
import Nav from "../../../components/Dashboard/Nav.jsx"

function Log() {
	// For collecting the LOGS via backend API
	const [logs, setLogs] = useState([]);

	useEffect(() => {
		fetch('http://localhost:3000/api/logs/logs')
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
					<h1 className="h3 fw-bold text-dark">Database</h1>
					<p className="text-muted">Download the database of Vehicle listings</p>
				</div>

				<div className="row g-4">
					{/* Download Section */}
					<div className="col-12">
						<div className="card shadow-sm border-0 p-4 text-center">
							<div className="card-body">
								<i className="bi bi-cloud-download text-primary mb-3" style={{ fontSize: '3rem' }}></i>
								<h2 className="h5 fw-bold">Export Full Database</h2>
								<p className="text-muted">Click the button below to generate and download a complete JSON export of all vehicle listings.</p>
								{/* Important: Add 'credentials: include' to the fetch call inside handleDownload 
								*/}
								<button className="btn btn-primary btn-lg px-5 shadow-sm">
									<i className="bi bi-download me-2"></i> Download Listings (.json)
								</button>
							</div>
						</div>
					</div>

					{/* Info Box 1: Backup Schedule */}
					<div className="col-md-6">
						<div className="card border-0 shadow-sm h-100">
							<div className="card-body d-flex align-items-start gap-3">
								<div className="bg-info bg-opacity-10 p-3 rounded">
									<i className="bi bi-shield-check text-info"></i>
								</div>
								<div>
									<h6 className="fw-bold mb-1">Backup Schedule</h6>
									<p className="text-muted small mb-0">System-wide backups are automatically generated every 2 months to ensure data integrity and disaster recovery.</p>
								</div>
							</div>
						</div>
					</div>

					{/* Info Box 2: Database Type & Manual */}
					<div className="col-md-6">
						<div className="card border-0 shadow-sm h-100">
							<div className="card-body d-flex align-items-start gap-3">
								<div className="bg-warning bg-opacity-10 p-3 rounded">
									<i className="bi bi-gear-wide-connected text-warning"></i>
								</div>
								<div>
									<h6 className="fw-bold mb-1">Database Configuration</h6>
									<p className="text-muted small mb-2">This is a Mongoose-based MongoDB database. For advanced tuning or cluster configurations:</p>
									<a href="/manuals/advanced-config.pdf" className="btn btn-sm btn-outline-dark">
										<i className="bi bi-file-earmark-text me-1"></i> Advanced Configuration Manual
									</a>
								</div>
							</div>
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