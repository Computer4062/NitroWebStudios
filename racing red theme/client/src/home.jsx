import { useState, useEffect } from 'react'

import NavBar from './components/navbar/NavBar'
import Footer from './components/footer/Footer'
import Search from './components/advanced-search/Search'
import Card from './components/card/Card'
import Ticker from './components/Ticker/Ticker'
import "./home.css"

function Home() {

const features = [
    {
      icon: "🚚", // You can replace these with <img> or FontAwesome icons
      title: "Fast Delivery",
      desc: "Get your vehicle delivered to your doorstep within 48 hours."
    },
    {
      icon: "🛡️",
      title: "Certified Quality",
      desc: "Every car undergoes a rigorous 150-point inspection process."
    },
    {
      icon: "💰",
      title: "Best Pricing",
      desc: "No hidden fees. We offer the most competitive rates in the market."
    }
  ];

  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/vehicles/all')
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
        <Ticker/>
      </section>

      <section>
        <NavBar />
      </section>

      <section class="home-cover">
        <div>
          <Search />
        </div>
      </section>
      
      <section>
      <div className="container py-5">
        {/* justify-content-center helps if you have fewer than 6 items on the last row */}
        <div className="row mb-3 text-center g-3 justify-content-center"> 
          
          {/* col-4 = 3 per row on mobile | col-md-2 = 6 per row on desktop */}
          <div className="col-4 col-md-2 themed-grid-col">
            <img width="70" height="70" src={"../../../public/images/bmw-logo.png"} alt="BMW"/>
          </div> 
          <div className="col-4 col-md-2 themed-grid-col">
            <img width="70" height="70" src={"../../../public/images/mecury.png"} alt="Mercury"/>
          </div> 
          <div className="col-4 col-md-2 themed-grid-col">
            <img width="70" height="70" src={"../../../public/images/ford-logo.png"} alt="Ford"/>
          </div> 
          <div className="col-4 col-md-2 themed-grid-col">
            <img width="70" height="70" src={"../../../public/images/ducati-logo.png"} alt="Ducati"/>
          </div> 
          <div className="col-4 col-md-2 themed-grid-col">
            <img width="70" height="70" src={"../../../public/images/lincoln-motor.png"} alt="Lincoln"/>
          </div>
          {/* Add your 6th image here to complete the first row on desktop */}
          
        </div>
      </div>
      </section>

      <section>
      <div class="album py-5 bg-body-tertiary">
      <div class="container">
        <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">

          {items.map((item) => (
          item.featured && (
            <Card item={item} />
          )
          ))}

        </div>
      </div>
      </div>
      </section>

      <section>
        <div className="container py-5">
        <h2 className="text-center mb-5 fw-bold">Why Choose Us</h2>
        
        {/* Scrollable Wrapper */}
        <div className="custom-scroll-row d-flex flex-nowrap flex-md-wrap overflow-auto">
          {features.map(function(item, index) {
            return (
              <div key={index} className="col-9 col-md-4 flex-shrink-0 mb-4 px-3 text-center">
                <div className="p-4 border rounded shadow-sm h-100">
                  <div className="display-4 mb-3">{item.icon}</div>
                  <h4 className="fw-bold">{item.title}</h4>
                  <p className="text-muted">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      </section>

      <section className="bg-body-tertiary">
        <div className="container py-5">
          <h3 className="ps-3 mb-4" style={{ borderLeft: "4px solid #E62117", fontWeight: "700" }}>
            Latest from Facebook
          </h3>
          
          {/* 1. Added 'custom-scroll-row' for the scrollbar styling.
            2. Switched 'flex-wrap' to 'flex-nowrap' for mobile.
            3. Added 'overflow-auto' to allow scrolling.
          */}
          <div className="custom-scroll-row d-flex flex-nowrap flex-md-wrap justify-content-start justify-content-md-center gap-4 overflow-auto pb-3">
              {[1, 2, 3].map((post) => (
                  <div 
                    key={post} 
                    className="card border-0 shadow-sm flex-shrink-0" // flex-shrink-0 is vital!
                    style={{ width: "18rem", borderRadius: "10px" }}
                  >
                      {/* Facebook Header Style */}
                      <div className="card-body d-flex align-items-center py-2">
                          <div className="bg-secondary rounded-circle" style={{ width: "35px", height: "35px" }}></div>
                          <div className="ms-2">
                              <p className="mb-0 fw-bold" style={{ fontSize: "0.8rem" }}>Car Dealership</p>
                              <p className="text-muted mb-0" style={{ fontSize: "0.7rem" }}>2 hours ago · 🌐</p>
                          </div>
                      </div>

                      {/* Post Image */}
                      <img 
                          src={`https://via.placeholder.com/300x200`} 
                          className="card-img-top" 
                          alt="Facebook Post Content" 
                      />

                      <div className="card-body">
                          <p className="card-text" style={{ fontSize: "0.9rem" }}>
                              Just arrived! The new 2026 Model is now in our showroom. Come by for a test drive today! 🏎️💨 #NewArrivals
                          </p>
                          <hr className="my-2" />
                          <div className="d-flex justify-content-between text-muted" style={{ fontSize: "0.8rem" }}>
                              <span>👍 24 Likes</span>
                              <span>💬 5 Comments</span>
                          </div>
                      </div>
                      
                      {/* View on Facebook Button */}
                      <div className="card-footer bg-white border-0 text-center pb-3">
                          <button className="btn btn-outline-primary btn-sm w-100">
                              View on Facebook
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