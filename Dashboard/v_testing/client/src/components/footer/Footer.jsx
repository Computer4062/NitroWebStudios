import React from "react"
import "./Footer.css"

function Footer(){
	return(
		<footer className="footer-dark pt-5 pb-3 px-3">
		<div className="container">
			<div className="row mb-4">
			{/* Column 1: Brand - Always Visible */}
			<div className="col-lg-4 col-md-12 mb-4">
				<h5 className="text-warning fw-bold mb-3 tracking-wider">CAR DEALERSHIP</h5>
				<p className="text-secondary small" style={{ lineHeight: '1.8' }}>
				Providing the finest selection of luxury and performance vehicles. 
				Experience the drive of your life with our certified premium inventory.
				</p>
			</div>

			{/* Column 2: Quick Links (Collapsible on Mobile) */}
			<div className="col-lg-2 col-md-4 mb-0 mb-md-4 footer-accordion">
				<div 
				className="d-flex justify-content-between align-items-center d-md-block"
				data-bs-toggle="collapse" 
				data-bs-target="#quickLinks"
				>
				<h6 className="text-white fw-bold mb-3 mt-1">Quick Links</h6>
				<i className="bi bi-chevron-down d-md-none text-warning"></i>
				</div>
				<ul className="list-unstyled footer-links collapse d-md-block" id="quickLinks">
				<li><a href="#">Inventory</a></li>
				<li><a href="#">Electric Cars</a></li>
				<li><a href="#">Test Drive</a></li>
				<li><a href="#">Financing</a></li>
				</ul>
			</div>

			{/* Column 3: Support (Collapsible on Mobile) */}
			<div className="col-lg-2 col-md-4 mb-0 mb-md-4 footer-accordion">
				<div 
				className="d-flex justify-content-between align-items-center d-md-block"
				data-bs-toggle="collapse" 
				data-bs-target="#supportLinks"
				>
				<h6 className="text-white fw-bold mb-3 mt-1">Support</h6>
				<i className="bi bi-chevron-down d-md-none text-warning"></i>
				</div>
				<ul className="list-unstyled footer-links collapse d-md-block" id="supportLinks">
				<li><a href="#">Contact Us</a></li>
				<li><a href="#">About Us</a></li>
				<li><a href="#">Privacy Policy</a></li>
				<li><a href="#">FAQs</a></li>
				</ul>
			</div>

			{/* Column 4: Contact Info - Always Visible */}
			<div className="col-lg-4 col-md-4 mb-4">
				<h6 className="text-white fw-bold mb-3">Visit Our Showroom</h6>
				<p className="text-secondary small mb-1">123 Supercar Blvd, Luxury Suite 100</p>
				<p className="text-warning fw-bold">+1 (555) 012-3456</p>
			</div>
			</div>

			{/* Bottom Bar */}
			<div className="border-top border-secondary pt-4 mt-4 d-flex flex-wrap justify-content-between align-items-center text-center text-md-start">
			<div className="col-12 col-md-4 mb-3 mb-md-0">
				<span className="text-secondary small">© 2026 Car Dealership, Inc.</span>
			</div>
			<ul className="nav col-12 col-md-4 justify-content-center justify-content-md-end list-unstyled d-flex social-icons">
				<li className="ms-3"><a href="#" className="text-secondary"><i className="bi bi-instagram"></i></a></li>
				<li className="ms-3"><a href="#" className="text-secondary"><i className="bi bi-facebook"></i></a></li>
				<li className="ms-3"><a href="#" className="text-secondary"><i className="bi bi-twitter-x"></i></a></li>
			</ul>
			</div>
		</div>
		</footer>
	);
}

export default Footer;