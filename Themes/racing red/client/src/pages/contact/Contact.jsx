import {useState, useEffect} from "react"

import NavBar from "../../components/navbar/NavBar.jsx"
import Footer from "../../components/footer/Footer.jsx"
import Ticker from '../../components/Ticker/Ticker'
import "./Contact.css"

function Contact() {

  return (
    <>
    <section>
        <Ticker/>
      </section>

      <section>
        <NavBar/>
      </section>

      <section>
      <div class="container">
      <main>
          <div class="py-5 text-center cover-img-contact">
              <img
                  class="d-block mx-auto mb-4"
                  src={"../../../public/images/logo.jpg"}
                  alt=""
                  width="72"
                  height="57"
              />
              <p class="lead">
                  Feel free to ask us any questions, we are here at your service, our customers come first!
              </p>
          </div>

        <div className="container py-4">
        <div className="row g-5">
            {/* LEFT SIDE: Contact Form */}
            <div className="col-md-7 col-lg-8">
            <h4 className="mb-3" style={{ borderLeft: "4px solid #E62117", paddingLeft: "15px" }}>
                Send us an Email
            </h4>
            <form className="needs-validation">
                <div className="row g-3">
                <div className="col-sm-6">
                    <label htmlFor="name" className="form-label">Full Name</label>
                    <input type="text" className="form-control" id="name" placeholder="John Doe" required />
                </div>

                <div className="col-sm-6">
                    <label htmlFor="email" className="form-label">Email Address</label>
                    <input type="email" className="form-control" id="email" placeholder="you@example.com" required />
                </div>

                <div className="col-12">
                    <label htmlFor="subject" className="form-label">Subject</label>
                    <select className="form-select" id="subject">
                    <option value="">Inquiry about a vehicle</option>
                    <option value="">Financing options</option>
                    <option value="">Test drive request</option>
                    <option value="">Other</option>
                    </select>
                </div>

                <div className="col-12">
                    <label htmlFor="message" className="form-label">Message</label>
                    <textarea className="form-control" id="message" rows="5" placeholder="How can we help you?" required></textarea>
                </div>
                </div>

                <hr className="my-4" />
                <button className="w-100 btn btn-danger btn-lg" type="submit" style={{ backgroundColor: "#E62117" }}>
                Send Message
                </button>
            </form>
            </div>

            {/* RIGHT SIDE: Contact Information Box */}
            <div className="col-md-5 col-lg-4  order-first order-md-2">
            <h4 className="d-flex justify-content-between align-items-center mb-3">
                <span style={{ color: "#E62117" }}>Our Office</span>
            </h4>
            <ul className="list-group mb-3 shadow-sm">
                <li className="list-group-item d-flex justify-content-between lh-sm py-3">
                <div>
                    <h6 className="my-0">Phone Number</h6>
                    <small className="text-body-secondary">+1 (555) 123-4567</small>
                </div>
                <span className="text-muted">📞</span>
                </li>
                <li className="list-group-item d-flex justify-content-between lh-sm py-3">
                <div>
                    <h6 className="my-0">Gmail Address</h6>
                    <small className="text-body-secondary">sales@cardealership.com</small>
                </div>
                <span className="text-muted">✉️</span>
                </li>
                <li className="list-group-item d-flex justify-content-between lh-sm py-3 bg-body-tertiary">
                <div>
                    <h6 className="my-0">Showroom Hours</h6>
                    <small className="text-body-secondary">Mon - Sat: 9 AM - 7 PM</small>
                </div>
                <span className="text-muted">⏰</span>
                </li>
            </ul>

            <div className="card shadow-sm border-0 overflow-hidden">
        <div className="ratio ratio-16x9">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.8354345093747!2d-122.4194155!3d37.7749295!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80859a6d00690021%3A0x4a501367f076adff!2sSan%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1611111111111!5m2!1sen!2sus" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy" 
            title="Office Location"
          ></iframe>
        </div>
        <div className="card-body bg-light text-center py-2">
          <small className="text-muted">123 Dealership Way, San Francisco, CA</small>
        </div>
      </div>

            <div className="card p-3 my-2 shadow-sm border-0 bg-dark text-white">
                <h5>Quick Support?</h5>
                <p className="small mb-0">Our team typically responds to emails within 24 hours.</p>
            </div>
            </div>
        </div>
        </div>
      </main>
      </div>

      </section>

      <section>
        <Footer/>
      </section>
    </>
  )
}

export default Contact;