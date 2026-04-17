import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import "react-responsive-carousel/lib/styles/carousel.min.css";

import NavBar from './components/navbar/NavBar'
import Footer from './components/footer/Footer'
import Card from './components/card/Card'
import "./home.css"

// -------------------------------------------------------
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");
// -------------------------------------------------------

function Home() {

  // ----------------------------------------------------------------------------------------
    const location = useLocation();

  useEffect(() => {
    // Fire the event to the server whenever the URL path changes
    socket.emit('page_view', { 
      pagePath: location.pathname 
    });
  }, [location]);
  // ----------------------------------------------------------------------------------------

  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/stocks/all')
      .then((response) => response.json())
      .then((data) => {
        setItems(data);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, []);

  return (
    <>
      <section>
        <NavBar />
      </section>

      <section>
        <div id="carouselExample" class="carousel slide carousel-fade" data-bs-ride="carousel">
            <div class="carousel-inner">
              
              <div class="carousel-item active">
                <img src={"/carousel/img-3.jpg"} class="d-block w-100" alt="Luxury Sedan" />
                <div class="carousel-caption">
                  <h2>Drive Your Dream</h2>
                  <p>Explore our exclusive collection of 2026 luxury arrivals.</p>
                  <button class="btn btn-warning">View Inventory</button>
                </div>
              </div>

              <div class="carousel-item">
                <img src={"/carousel/img-2.jpg"} class="d-block w-100" alt="Sports Car" />
                <div class="carousel-caption">
                  <h2>Precision Performance</h2>
                  <p>Engineered for those who refuse to compromise.</p>
                  <button class="btn btn-light">Book a Test Drive</button>
                </div>
              </div>

              <div class="carousel-item">
                <img src={"/carousel/img-4.jpg"} class="d-block w-100" alt="SUV" />
                <div class="carousel-caption">
                  <h2>Certified Quality</h2>
                  <p>The best pre-owned vehicles with a warranty.</p>
                  <button class="btn btn-outline-light">Current Offers</button>
                </div>
              </div>

            </div>

            <button class="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
              <span class="carousel-control-next-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Next</span>
            </button>
          </div>
      </section>

      <section className="py-5 bg-dark">
        <div className="container">
          {/* Stylish Heading Section */}
          <div className="row mb-5">
            <div className="col-12 text-center text-md-start">
              <h6 className="text-warning text-uppercase fw-bold mb-2 tracking-wider">
                Experience Excellence
              </h6>
              <h2 className="display-5 text-white fw-bold arrivals-heading">
                Our New <span className="text-warning">Arrivals</span>
              </h2>
              <div className="heading-line"></div>
            </div>
          </div>

          <div className="row g-4">
            {items.map((item) => (
              item.featured && (
                <div className="col-12 col-md-6 col-lg-4" key={item.id}>
                  <Card item={item} />
                </div>
              )
            ))}
          </div>
        </div>
      </section>

      <section className="py-5 dark-social-section">
        <div className="container">
          {/* Heading with your signature gold accent */}
          <h3 className="ps-3 mb-5 text-white" style={{ borderLeft: "4px solid #ffc107", fontWeight: "700", letterSpacing: "1px" }}>
            LATEST UPDATES
          </h3>
          
          <div className="custom-scroll-row d-flex flex-nowrap flex-md-wrap justify-content-start justify-content-md-center gap-4 overflow-auto pb-4">
            {[1, 2, 3].map((post) => (
              <div 
                key={post} 
                className="card facebook-card border-0 flex-shrink-0" 
                style={{ width: "20rem", borderRadius: "0px" }} // Rectangular to match your search bar
              >
                {/* Header Style - Darker & Cleaner */}
                <div className="card-body d-flex align-items-center py-3 bg-black">
                  <div className="bg-warning rounded-circle d-flex align-items-center justify-content-center" style={{ width: "38px", height: "38px" }}>
                    <i className="bi bi-facebook text-dark"></i>
                  </div>
                  <div className="ms-3">
                    <p className="mb-0 fw-bold text-white" style={{ fontSize: "0.9rem" }}>Car Dealership</p>
                    <p className="text-secondary mb-0" style={{ fontSize: "0.75rem" }}>2 hours ago · <span className="text-warning">🌐</span></p>
                  </div>
                </div>

                {/* Post Image with subtle zoom effect container */}
                <div className="overflow-hidden">
                  <img 
                    src={`https://via.placeholder.com/400x250/111/eee?text=New+Arrival`} 
                    className="card-img-top facebook-img" 
                    alt="Post Content" 
                  />
                </div>

                <div className="card-body bg-black text-secondary">
                  <p className="card-text mb-3" style={{ fontSize: "0.9rem", lineHeight: "1.6" }}>
                    Just arrived! The new 2026 Model is now in our showroom. Come by for a test drive today! 🏎️💨 <span className="text-warning">#NewArrivals</span>
                  </p>
                  <div className="d-flex justify-content-between border-top border-secondary pt-3 mt-2" style={{ fontSize: "0.8rem" }}>
                    <span><i className="bi bi-hand-thumbs-up-fill me-1"></i> 24 Likes</span>
                    <span>5 Comments</span>
                  </div>
                </div>
                
                {/* Button - Rectangular & Warning themed */}
                <div className="card-footer bg-black border-0 pb-4">
                  <button className="btn btn-outline-warning btn-sm w-100 py-2" style={{ borderRadius: "0px", fontWeight: "600", letterSpacing: "1px" }}>
                    VIEW ON FACEBOOK
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <Footer />
      </section>

    </>
  )
}

export default Home