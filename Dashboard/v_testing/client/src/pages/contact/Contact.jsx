import {useState, useEffect} from "react"

import NavBar from "../../components/navbar/NavBar.jsx"
import Footer from "../../components/footer/Footer.jsx"
import Ticker from '../../components/Ticker/Ticker'
import "./Contact.css"

function Contact() {

  return (
    <>
      <section>
        <NavBar/>
      </section>

    <section className="bg-dark py-5">
    <div className="container">
        <main>
        {/* Header Section */}
        <div className="py-5 text-center">
            <img
            className="d-block mx-auto mb-4"
            src={"/images/logo.jpg"}
            alt="Logo"
            width="80"
            height="80"
            style={{ border: '2px solid #ffc107', padding: '5px' }}
            />
            <h2 className="text-white fw-bold arrivals-heading mb-3">GET IN <span className="text-warning">TOUCH</span></h2>
            <p className="lead text-secondary mx-auto" style={{ maxWidth: '700px' }}>
            Feel free to ask us any questions. We are here at your service—our customers always come first!
            </p>
        </div>

        <div className="row g-5">
            {/* LEFT SIDE: Contact Form */}
            <div className="col-md-7 col-lg-8">
            <h4 className="mb-4 text-white ps-3" style={{ borderLeft: "4px solid #ffc107", fontWeight: "700" }}>
                SEND US AN EMAIL
            </h4>
            
            <form className="contact-form-custom">
                <div className="row g-3">
                <div className="col-sm-6">
                    <label htmlFor="name" className="form-label text-warning small fw-bold">FULL NAME</label>
                    <input type="text" className="form-control form-control-custom" id="name" placeholder="John Doe" required />
                </div>

                <div className="col-sm-6">
                    <label htmlFor="email" className="form-label text-warning small fw-bold">EMAIL ADDRESS</label>
                    <input type="email" className="form-control form-control-custom" id="email" placeholder="you@example.com" required />
                </div>

                <div className="col-12">
                    <label htmlFor="subject" className="form-label text-warning small fw-bold">SUBJECT</label>
                    <select className="form-select form-select-custom" id="subject">
                    <option value="">Inquiry about a vehicle</option>
                    <option value="">Financing options</option>
                    <option value="">Test drive request</option>
                    <option value="">Other</option>
                    </select>
                </div>

                <div className="col-12">
                    <label htmlFor="message" className="form-label text-warning small fw-bold">MESSAGE</label>
                    <textarea className="form-control form-control-custom" id="message" rows="5" placeholder="How can we help you?" required></textarea>
                </div>
                </div>

                <hr className="my-4 border-secondary" />
                
                <button className="btn btn-warning btn-lg w-100 fw-bold border-0 py-3" type="submit" style={{ borderRadius: 0 }}>
                SEND MESSAGE
                </button>
            </form>
            </div>

            {/* RIGHT SIDE: Contact Info */}
            <div className="col-md-5 col-lg-4 order-first order-md-2">
            <h4 className="mb-4 text-white ps-3" style={{ borderLeft: "4px solid #ffc107", fontWeight: "700" }}>
                OUR OFFICE
            </h4>
            
            <ul className="list-group mb-4">
                <li className="list-group-item d-flex justify-content-between align-items-center bg-black border-secondary text-white py-3">
                <div>
                    <h6 className="my-0 text-warning small fw-bold">PHONE NUMBER</h6>
                    <small className="text-secondary">+1 (555) 123-4567</small>
                </div>
                <i className="bi bi-telephone text-warning fs-5"></i>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center bg-black border-secondary text-white py-3">
                <div>
                    <h6 className="my-0 text-warning small fw-bold">EMAIL ADDRESS</h6>
                    <small className="text-secondary">sales@cardealership.com</small>
                </div>
                <i className="bi bi-envelope text-warning fs-5"></i>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center bg-black border-secondary text-white py-3">
                <div>
                    <h6 className="my-0 text-warning small fw-bold">SHOWROOM HOURS</h6>
                    <small className="text-secondary">Mon - Sat: 9 AM - 7 PM</small>
                </div>
                <i className="bi bi-clock text-warning fs-5"></i>
                </li>
            </ul>

            {/* Map Card */}
            <div className="card shadow-lg border-0 overflow-hidden mb-4" style={{ borderRadius: 0 }}>
                <div className="ratio ratio-16x9">
                <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.019297150005!2d-122.4194155!3d37.7749295!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085809c6c8f4459%3A0xb10ed6d9b5050c62!2sSan%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus" 
                    style={{ border: 0, filter: 'grayscale(100%) invert(90%)' }} 
                    allowFullScreen="" 
                    loading="lazy" 
                    title="Office Location"
                ></iframe>
                </div>
                <div className="card-body bg-black text-center py-2 border-top border-secondary">
                <small className="text-secondary">123 Dealership Way, San Francisco, CA</small>
                </div>
            </div>

            <div className="p-4 shadow-sm border-0 bg-warning text-dark text-center">
                <h5 className="fw-bold mb-1">QUICK SUPPORT?</h5>
                <p className="small mb-0 fw-semibold">We typically respond within 24 hours.</p>
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