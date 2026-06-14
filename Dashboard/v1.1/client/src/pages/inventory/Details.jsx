import {useState, useEffect} from "react"
import { useLocation, useParams, Link } from "react-router-dom"

import NavBar from "../../components/navbar/NavBar.jsx"
import Footer from "../../components/footer/Footer.jsx"
import Ticker from '../../components/Ticker/Ticker'
import "./Details.css"

// --------------------------------------------------------
import { io } from "socket.io-client";

// 1. Establish or retrieve the tab's unique Session ID from sessionStorage
let sessionId = sessionStorage.getItem('analytics_session_id');
if (!sessionId) {
  // Generates a clean random string like "sess_a1b2c3d4"
  sessionId = 'sess_' + Math.random().toString(36).substring(2, 15);
  sessionStorage.setItem('analytics_session_id', sessionId);
}

// 2. Connect to your backend server, passing the session ID in the auth payload
const socket = io("https://nitroweb-studios-demo-site.onrender.com", {
  auth: { sessionId }
});
// --------------------------------------------------------

function Details() {
	const location = useLocation();

	// -------------------------------------------------------- FOR TRACKING
	useEffect(() => {
		// Wait until the socket is fully ready, then emit the path change
		const currentPath = location.pathname;

		if (socket.connected) {
		socket.emit('page_view', { pagePath: currentPath });
		} else {
		// If the socket is still connecting, wait for the connection event first
		socket.once('connect', () => {
			socket.emit('page_view', { pagePath: currentPath });
		});
		}

	}, [location]); // Fires flawlessly whenever the product URL route changes
	// --------------------------------------------------------


	const {id} = useParams();

  	const [activeImg, setActiveImg] = useState(0);
	const [otherCardData, setOtherCardData] = useState([]);

	//let car = location.state.car;
	//let gallery = car.images;

	const [vehicle, setVehicle] = useState([]);
	const [gallery, setGallery] = useState([]);

	// Get the specific car based off of the id assigned
	useEffect(() => {
    fetch(`https://nitroweb-studios-demo-site.onrender.com/api/stocks/find/one/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setVehicle(data);
		setGallery(data[0].images);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  	}, []);

	// Get vehicles of similar type
	useEffect(() => {
    fetch(`https://nitroweb-studios-demo-site.onrender.com/api/stocks/find/type/${vehicle.type}`)
      .then((response) => response.json())
      .then((data) => {
        setOtherCardData(data);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  	}, []);

  // ... inside your component ...
const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
const [isZoomed, setIsZoomed] = useState(false);

const handleMouseMove = (e) => {
  const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
  
  // Calculate mouse position in percentage
  const x = ((e.pageX - left) / width) * 100;
  const y = ((e.pageY - top) / height) * 100;
  
  setZoomPos({ x, y });
};

  return (
    <>
      <section>
        <NavBar/>
      </section>

	
	<section className="bg-dark text-white py-5">
	{vehicle.map((car) => (
		<div className="container">
			{/* 1. TOP SECTION: Model and Year */}
			
			<div className="mb-5">
				<h1 className="display-4 fw-bold mb-0 text-uppercase tracking-wider">
					{car.year} <span className="text-warning">{car.model}</span>
				</h1>
				<p className="text-secondary small fw-bold mt-1">STOCK ID: {car._id.substring(0, 8).toUpperCase()}</p>
				<div className="heading-line mb-4" style={{ width: "80px", height: "4px", backgroundColor: "#ffc107" }}></div>

				<div className="position-relative">
					{car.featured && (
						<span className="badge bg-warning text-dark position-absolute top-0 start-0 m-3 shadow-lg fw-bold" 
							style={{ zIndex: 10, padding: '10px 20px', fontSize: '0.9rem', borderRadius: '0' }}>
							★ FEATURED VEHICLE
						</span>
					)}
				</div>
			</div>

			<div className="row g-5">
				{/* 2. LEFT SIDE: Image Gallery */}
				<div className="col-md-7">
						<div 
						className="main-image-container mb-3 border border-secondary overflow-hidden bg-black position-relative"
						onMouseMove={handleMouseMove}
						onMouseEnter={() => setIsZoomed(true)}
						onMouseLeave={() => setIsZoomed(false)}
						style={{ cursor: isZoomed ? 'zoom-in' : 'pointer' }}
					>
						<img 
						src={`https://nitroweb-studios-demo-site.onrender.com/public${gallery[activeImg]}`} 
						className="img-fluid w-100 main-car-image" 
						alt={car.model}
						style={{ 
							minHeight: "450px", 
							objectFit: "cover",
							transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`, // Point of focus
							transform: isZoomed ? 'scale(2.5)' : 'scale(1)', // Scale factor
							transition: isZoomed ? 'none' : 'transform 0.5s ease' // Smooth exit
						}}
						/>
						
						{/* Optional: Small Hint Overlay */}
						{!isZoomed && (
						<div className="position-absolute bottom-0 end-0 m-3 px-2 py-1 bg-dark text-warning small fw-bold opacity-75">
							<i className="bi bi-search me-1"></i> HOVER TO ZOOM
						</div>
						)}
					</div>
					
					{/* Thumbnails */}
					<div className="d-flex gap-2 custom-scroll-row overflow-auto pb-2">
						{gallery.map((img, index) => (
							<img 
								key={index}
								src={`https://nitroweb-studios-demo-site.onrender.com/public${img}`} 
								className={`cursor-pointer border ${activeImg === index ? 'border-warning' : 'border-secondary'}`}
								style={{ width: "100px", height: "70px", cursor: "pointer", objectFit: "cover", opacity: activeImg === index ? 1 : 0.6 }}
								onClick={() => setActiveImg(index)}
							/>
						))}
					</div>
				</div>

				{/* 3. RIGHT SIDE: Action Card & Quick Specs */}
				<div className="col-md-5">
					<div className="card bg-black border border-secondary p-4 h-100 rounded-0 shadow-lg">
						<h2 className="text-warning fw-bold display-6 mb-4">${car.price.toLocaleString()}</h2>
						
						<div className="specs-list mb-5">
							<div className="d-flex justify-content-between border-bottom border-secondary py-3">
								<span className="text-secondary text-uppercase small fw-bold">Engine</span>
								<span className="text-white fw-semibold">{car.engine || "V8 Turbo"}</span>
							</div>
							<div className="d-flex justify-content-between border-bottom border-secondary py-3">
								<span className="text-secondary text-uppercase small fw-bold">Fuel Type</span>
								<span className="text-white fw-semibold text-capitalize">{car.fuel}</span>
							</div>
							<div className="d-flex justify-content-between border-bottom border-secondary py-3">
								<span className="text-secondary text-uppercase small fw-bold">Transmission</span>
								<span className="text-white fw-semibold">{car.transmission || "Automatic"}</span>
							</div>
							<div className="d-flex justify-content-between border-bottom border-secondary py-3">
								<span className="text-secondary text-uppercase small fw-bold">Mileage</span>
								<span className="text-white fw-semibold">{car.mileage || "0"} MILES</span>
							</div>
						</div>

						<div className="d-grid gap-3">
							<button className="btn btn-warning fw-bold py-3 rounded-0 text-uppercase tracking-wider">
								Schedule Test Drive
							</button>
							<button className="btn btn-outline-secondary text-white fw-bold py-3 rounded-0 text-uppercase tracking-wider">
								Value Your Trade
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* 4. BOTTOM SECTION: Description */}
			<div className="row mt-5 pt-4">
				<div className="col-12">
					<h4 className="text-white fw-bold mb-4 text-uppercase tracking-wider ps-3" style={{ borderLeft: "4px solid #ffc107" }}>
						Vehicle Description
					</h4>
					<p className="mt-3 lh-lg text-secondary fs-5" style={{ textAlign: 'justify' }}>
						{car.description || "Experience the pinnacle of automotive engineering with this stunning " + car.model + ". This vehicle has undergone a rigorous 150-point inspection to ensure it meets our highest standards of performance and safety."}
					</p>
				</div>
			</div>
		</div>
		))}
	</section>

	{/* 5. SIMILAR OPTIONS SECTION */}
	<section className="bg-black py-5 border-top border-secondary">
		<div className="container mt-4">
			<h3 className="mb-5 fw-bold text-white text-uppercase tracking-wider">Similar <span className="text-warning">Options</span></h3>
			
			<div className="custom-scroll-row d-flex overflow-auto pb-4 gap-4">
				{otherCardData.map((item) => (
					<div key={item._id} className="flex-shrink-0" style={{ width: "300px" }}>
						<div className="card bg-dark border-secondary rounded-0 h-100 similar-card">
							<div className="position-relative overflow-hidden">
								{item.isSpecial && (
									<span className="badge position-absolute top-0 start-0 m-2 bg-warning text-dark fw-bold rounded-0" style={{zIndex: 2}}>
										SPECIAL
									</span>
								)}
								<img 
									src={`https://nitroweb-studios-demo-site.onrender.com/public${item.images[0]}`} 
									className="card-img-top rounded-0 grayscale-filter-sm" 
									alt={item.model} 
									style={{ height: "180px", objectFit: "cover" }}
								/>
							</div>

							<div className="card-body bg-black">
								<h6 className="fw-bold text-white mb-1 text-uppercase">{item.year} {item.model}</h6>
								<p className="text-warning fw-bold mb-3">${item.price.toLocaleString()}</p>
								<Link 
									onClick={() => window.scrollTo(0, 0)} 
									to={`/inventory/${item._id}`} 
									className="btn btn-outline-warning btn-sm w-100 fw-bold rounded-0 py-2"
									state = {{car: item}}
								>
									VIEW DETAILS
								</Link>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	</section>

      <section>
        <Footer/>
      </section>
    </>
  )
}

export default Details;