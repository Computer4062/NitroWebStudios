import {useState, useEffect} from "react"

import NavBar from "../../components/navbar/NavBar.jsx"
import Footer from "../../components/footer/Footer.jsx"
import Ticker from '../../components/Ticker/Ticker'

function OurTeam() {

  return (
    <>
        <section>
        <Ticker/>
      </section>

      <section>
        <NavBar/>
      </section>

      <section>
      <div className="team-hero-banner d-flex align-items-center justify-content-center text-center mt-3">
          <div className="container">
              <div className="row justify-content-center">
                  <div className="col-lg-8">
                      {/* Centered Heading */}
                      <h1 className="display-3 fw-bold mb-3 team-title">
                          Our <span style={{ color: "#E62117" }}>Team</span>
                      </h1>
                      
                      {/* mx-auto centers the paragraph since it has a max-width */}
                      <p className="lead fs-4 mb-4 mx-auto">
                          Meet the experts behind the wheel. From master technicians to 
                          dedicated sales consultants, our family is here to help you 
                          find yours.
                      </p>

                  </div>
              </div>
          </div>
      </div>
      </section>

    <section>
    <div className="container marketing">
        <hr className="featurette-divider" />

        {/* OWNER 1 */}
        <div className="row featurette align-items-center">
        {/* Added mb-4 for mobile spacing and text-center for better phone layout */}
        <div className="col-md-7 mb-4 mb-md-0 text-center text-md-start">
            <h2 className="featurette-heading fw-normal lh-1">
            John Doe <span className="text-body-secondary">| Founder & CEO</span>
            </h2>
            <p className="lead mt-3">
            With over 20 years in the automotive industry, John started this dealership with a single mission: to make car buying transparent and enjoyable.
            </p>
            <a href="https://linkedin.com/in/dummy-profile-1" target="_blank" rel="noreferrer" className="btn btn-outline-primary mt-2">
            <i className="bi bi-linkedin me-2"></i>View LinkedIn Profile
            </a>
        </div>
        <div className="col-md-5">
            <img 
            src="https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=500" 
            className="bd-placeholder-img bd-placeholder-img-lg featurette-image img-fluid mx-auto rounded shadow" 
            alt="John Doe" 
            />
        </div>
        </div>

        <hr className="featurette-divider" />

        {/* OWNER 2 - Reversed Layout */}
        <div className="row featurette align-items-center">
        {/* On mobile, this will now have a margin-bottom so it doesn't touch the image below it */}
        <div className="col-md-7 order-md-2 mb-4 mb-md-0 text-center text-md-start">
            <h2 className="featurette-heading fw-normal lh-1">
            Jane Smith <span className="text-body-secondary">| Operations Director</span>
            </h2>
            <p className="lead mt-3">
            Jane ensures that every vehicle in our inventory meets the highest standards of safety and performance.
            </p>
            <a href="https://linkedin.com/in/dummy-profile-2" target="_blank" rel="noreferrer" className="btn btn-outline-primary mt-2">
            <i className="bi bi-linkedin me-2"></i>View LinkedIn Profile
            </a>
        </div>
        <div className="col-md-5 order-md-1">
            <img 
            src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=500" 
            className="bd-placeholder-img bd-placeholder-img-lg featurette-image img-fluid mx-auto rounded shadow" 
            alt="Jane Smith" 
            />
        </div>
        </div>

        <hr className="featurette-divider" />

        {/* OWNER 3 */}
        <div className="row featurette align-items-center">
        <div className="col-md-7 mb-4 mb-md-0 text-center text-md-start">
            <h2 className="featurette-heading fw-normal lh-1">
            Michael Chen <span className="text-body-secondary">| Head of Finance</span>
            </h2>
            <p className="lead mt-3">
            Michael works tirelessly with our banking partners to ensure that you get the best rates possible.
            </p>
            <a href="https://linkedin.com/in/dummy-profile-3" target="_blank" rel="noreferrer" className="btn btn-outline-primary mt-2">
            <i className="bi bi-linkedin me-2"></i>View LinkedIn Profile
            </a>
        </div>
        <div className="col-md-5">
            <img 
            src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=500" 
            className="bd-placeholder-img bd-placeholder-img-lg featurette-image img-fluid mx-auto rounded shadow" 
            alt="Michael Chen" 
            />
        </div>
        </div>

        <hr className="featurette-divider" />
    </div>
    </section>

      <section>
        <Footer/>
      </section>
    </>
  )
}

export default OurTeam;