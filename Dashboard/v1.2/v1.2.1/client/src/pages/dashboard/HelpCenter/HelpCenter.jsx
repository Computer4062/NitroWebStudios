import {useState, useEffect} from "react"
import { Link } from 'react-router-dom';

import Dash from "../../../components/Dashboard/Dash.jsx"
import Nav from "../../../components/Dashboard/Nav.jsx"

function HelpCenter() {
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
					<h1 className="h3 fw-bold text-dark">Info & Resources</h1>
					<p className="text-muted">Everything you need to configure and manage your dealership platform.</p>
				</div>

				<div className="row g-4">
					{/* Left Column: Documentation & Advanced Config */}
					<div className="col-lg-8">
						<div className="card border-0 shadow-sm mb-4">
							<div className="card-body p-4">
								<div className="d-flex align-items-center mb-3">
									<div className="bg-primary bg-opacity-10 p-2 rounded-3 me-3">
										<i className="bi bi-file-earmark-pdf text-primary h4 mb-0"></i>
									</div>
									<h5 className="card-title fw-bold mb-0">Platform Documentation</h5>
								</div>

								<p className="card-text text-secondary">
									Our comprehensive User Manual covers everything from initial inventory upload to managing multi-tenant dealership settings. 
									This PDF includes a step-by-step walkthrough for new staff members.
								</p>

								<a href="/downloads/manual.pdf" className="btn btn-outline-primary d-inline-flex align-items-center gap-2 mb-4">
									<i className="bi bi-download"></i> Download User Manual (PDF)
								</a>

								<hr className="my-4 opacity-25" />

								<div className="d-flex align-items-center mb-3">
									<div className="bg-warning bg-opacity-10 p-2 rounded-3 me-3">
										<i className="bi bi-gear-wide-connected text-warning h4 mb-0"></i>
									</div>
									<h5 className="card-title fw-bold mb-0">Advanced Configuration</h5>
								</div>

								<p className="card-text text-secondary">
									For technical administrators, the <strong>Advanced Setup Guide</strong> provides instructions on configuring 
									custom API endpoints, managing Webhook notifications for new leads, and fine-tuning the MERN-stack engine 
									for optimal performance.
								</p>

								<div className="alert alert-light border-start border-warning border-3 bg-white shadow-sm">
									<small className="text-muted d-block">Developer Note:</small>
									Advanced settings require SSH access to your VPS for environment variable modifications.
								</div>
							</div>
						</div>
					</div>

					{/* Right Column: Quick Links & New Contact Support Card */}
					<div className="col-lg-4">
						<div className="card border-0 shadow-sm mb-4">
							<div className="card-header bg-white py-3 border-0">
								<h6 className="fw-bold mb-0 text-dark text-uppercase small">Quick Resources</h6>
							</div>
							<div className="list-group list-group-flush border-top">
								<Link to="/privacy-policy" className="list-group-item list-group-item-action py-3 d-flex justify-content-between align-items-center">
									<span><i className="bi bi-shield-check me-2 text-success"></i> Privacy Policy</span>
									<i className="bi bi-chevron-right small text-muted"></i>
								</Link>
								<Link to="/terms" className="list-group-item list-group-item-action py-3 d-flex justify-content-between align-items-center">
									<span><i className="bi bi-file-text me-2 text-info"></i> Terms & Conditions</span>
									<i className="bi bi-chevron-right small text-muted"></i>
								</Link>
							</div>
						</div>

						{/* NEW: Replaced Black Latency box with Contact Support Box */}
						<div className="card border-0 shadow-sm bg-white border-top border-primary border-4">
							<div className="card-body p-4 text-center">
								<div className="bg-primary bg-opacity-10 p-3 rounded-circle d-inline-flex mb-3">
									<i className="bi bi-headset text-primary h3 mb-0"></i>
								</div>
								<h6 className="fw-bold text-dark mb-3">Technical Support</h6>
								
								<div className="text-start mb-3">
									<div className="d-flex align-items-center mb-2 small text-secondary">
										<i className="bi bi-envelope-fill me-2 text-muted"></i>
										support@nwstudios.com
									</div>
									<div className="d-flex align-items-center mb-2 small text-secondary">
										<i className="bi bi-telephone-fill me-2 text-muted"></i>
										+1 (555) 123-4567
									</div>
								</div>

								<a href="https://wa.me/15551234567" target="_blank" rel="noopener noreferrer" className="btn btn-success w-100 fw-bold d-flex align-items-center justify-content-center gap-2">
									<i className="bi bi-whatsapp"></i> Chat on WhatsApp
								</a>
								<p className="text-muted extra-small mt-2" style={{ fontSize: '0.75rem' }}>
									Support available Mon-Fri, 9AM-5PM EST
								</p>
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

export default HelpCenter;