import {useState, useEffect} from "react"
import { useLocation, useParams, Link } from "react-router-dom"

import NavBar from "../../components/navbar/NavBar.jsx"
import Footer from "../../components/footer/Footer.jsx"
import Ticker from '../../components/Ticker/Ticker'
import "./Details.css"

function Details() {
	const {id} = useParams();
	const location = useLocation();

  	const [activeImg, setActiveImg] = useState(0);
	const [otherCardData, setOtherCardData] = useState([]);

	let car = location.state.car;
	let gallery = car.images;

	useEffect(() => {
    fetch(`http://localhost:3000/api/vehicles/find/type/${car.type}`)
      .then((response) => response.json())
      .then((data) => {
        setOtherCardData(data);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, []);

  return (
    <>
    <section>
        <Ticker/>
      </section>

      <section>
        <NavBar/>
      </section>

	  <section>
		<div className="container py-4">
			{/* 1. TOP SECTION: Model and Year */}
			<div className="mb-4">
				<h1 className="display-5 fw-bold mb-0">{car.year} {car.model}</h1>
				<p className="text-muted fs-5">Stock ID: {car._id.substring(0, 8)}</p>
				<hr style={{ borderTop: "3px solid #E62117", width: "50px" }} />

				<div className="position-relative">
					{car.featured && (
						<span className="badge bg-danger position-absolute top-0 start-0 m-3 shadow" style={{ zIndex: 10, padding: '10px 15px', fontSize: '1.1rem' }}>
						★ FEATURED VEHICLE
						</span>
					)}
				</div>
			</div>

			<div className="row g-5">
				{/* 2. LEFT SIDE: Image Gallery */}
				<div className="col-md-7">
				<div className="main-image-container mb-3 shadow-sm rounded overflow-hidden bg-light">

					<img 
					src={`http://localhost:3000/public/images/${gallery[activeImg]}`} 
					className="img-fluid w-100" 
					alt={car.model}
					style={{ minHeight: "400px", objectFit: "cover" }}
					/>
				</div>
				
				{/* Thumbnails */}
				<div className="d-flex gap-2">
					{gallery.map((img, index) => (
					<img 
						key={index}
						src={`http://localhost:3000/public/images/${img}`} 
						className={`img-thumbnail cursor-pointer ${activeImg === index ? 'border-danger border-2' : ''}`}
						style={{ width: "80px", height: "60px", cursor: "pointer", objectFit: "cover" }}
						onClick={() => setActiveImg(index)}
					/>
					))}
				</div>
				</div>

				{/* 3. RIGHT SIDE: Action Card & Quick Specs */}
				<div className="col-md-5">
				<div className="card shadow-sm border-0 bg-white p-4">
					<h2 className="text-danger fw-bold mb-3">${car.price}</h2>
					
					<div className="specs-list mb-4">
					<div className="d-flex justify-content-between border-bottom py-2">
						<span className="text-muted">Engine</span>
						<span className="fw-bold">{car.engine || "V8 Turbo"}</span>
					</div>
					<div className="d-flex justify-content-between border-bottom py-2">
						<span className="text-muted">Fuel Type</span>
						<span className="fw-bold">{car.fuel}</span>
					</div>
					<div className="d-flex justify-content-between border-bottom py-2">
						<span className="text-muted">Transmission</span>
						<span className="fw-bold">{car.transmission || "Automatic"}</span>
					</div>
					<div className="d-flex justify-content-between border-bottom py-2">
						<span className="text-muted">Mileage</span>
						<span className="fw-bold">{car.mileage || "0"} miles</span>
					</div>
					</div>

					<div className="d-grid gap-2">
					<button className="btn btn-outline-dark">
						Schedule Test Drive
					</button>
					</div>
				
				</div>
				</div>
			</div>

			{/* 4. BOTTOM SECTION: Long Description */}
			<div className="row mt-5">
				<div className="col-12">
				<h4 className="border-bottom pb-2">Description</h4>
				<p className="mt-3 lh-lg text-secondary">
					{car.description || "Experience the pinnacle of automotive engineering with this stunning " + car.model + ". This vehicle has undergone a rigorous 150-point inspection to ensure it meets our highest standards of performance and safety. Featuring a refined interior and a powerful engine profile, it offers a driving experience that is both exhilarating and sophisticated."}
				</p>
				</div>
			</div>
			</div>
	  </section>

	  <section>
	  	<div className="container mt-5 pt-4 border-top">
		<h3 className="mb-4 fw-bold">Similar Options You Might Like</h3>
		
		{/* Horizontal Scroll Wrapper */}
		<div 
			className="d-flex overflow-auto pb-4 custom-scrollbar" 
			style={{ gap: "1.5rem", scrollSnapType: "x mandatory" }}
		>
			{otherCardData.map((item) => (
			<div 
				key={item._id} 
				className="flex-shrink-0" 
				style={{ width: "280px", scrollSnapAlign: "start" }}
			>
				<div className="card shadow-sm border-0 h-100 hvr-float">
				{/* Image with the "Special" badge logic we built earlier */}
				<div className="position-relative">
					{item.isSpecial && (
					<span className="badge position-absolute top-0 start-0 m-2 bg-danger" style={{fontSize: '0.7rem'}}>
						SPECIAL
					</span>
					)}
					<img 
					src={`http://localhost:3000/public/images/${item.images[0]}`} 
					className="card-img-top" 
					alt={item.model} 
					style={{ height: "160px", objectFit: "cover" }}
					/>
				</div>

				<div className="card-body">
					<h6 className="fw-bold mb-1">{item.year} {item.model}</h6>
					<p className="text-danger fw-bold mb-2">${item.price}</p>

					<div>
                		<Link onCLick={window.scrollTo(0, 0)} to={`/inventory/${item._id}`} state={{car: item}} type="button" className="btn btn-outline-danger btn-sm w-100">View Details</Link>
              		</div>
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