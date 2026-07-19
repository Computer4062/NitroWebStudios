import React from "react";
import Navbar from "../../components/NavBar/NavBar.jsx";
import HighlightCards from "../../components/HighlightCards/HighlightCards.jsx";
import "./Home.css";

/* Featured fleet data */
const fleet = [
  {
    name: "Elantra Grand",
    type: "Sedan",
    seats: "5 Seats",
    gearbox: "Automatic",
    price: "$49",
    img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Range Sovereign",
    type: "SUV",
    seats: "7 Seats",
    gearbox: "Automatic",
    price: "$89",
    img: "https://images.unsplash.com/photo-1568844293986-8d0400bd4745?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Velocity GT",
    type: "Sports",
    seats: "2 Seats",
    gearbox: "Manual",
    price: "$129",
    img: "https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Monarch Sedan",
    type: "Luxury",
    seats: "5 Seats",
    gearbox: "Automatic",
    price: "$149",
    img: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=700&q=80",
  },
];

/* Services data */
const services = [
  {
    title: "Airport Pickup & Drop",
    text: "Your car is waiting at arrivals — no counters, no queues.",
  },
  {
    title: "Chauffeur Driven",
    text: "Sit back with a professional driver for business or special occasions.",
  },
  {
    title: "Long-Term Leasing",
    text: "Monthly plans for relocations, projects, or extended stays.",
  },
  {
    title: "Corporate Accounts",
    text: "Centralized billing and priority fleet access for teams.",
  },
];

/* Process steps — a genuine sequence, so numbering earns its place */
const steps = [
  { n: "01", title: "Search & Compare", text: "Filter by dates, city, and vehicle class to see live availability." },
  { n: "02", title: "Book Online", text: "Reserve in minutes with instant e-confirmation, no paperwork." },
  { n: "03", title: "Hit the Road", text: "Pick up your car, or have it delivered, and drive off." },
];

const testimonials = [
  {
    quote:
      "Booking took two minutes and the car was spotless on pickup. This is how rentals should feel.",
    name: "Amelia Ford",
    role: "Frequent Traveler",
  },
  {
    quote:
      "Our company switched to Demo Car Rental for every business trip. Billing alone saves us hours a month.",
    name: "Marcus Odei",
    role: "Operations Lead, Northline Co.",
  },
  {
    quote:
      "Roadside support answered in under three minutes at midnight. That kind of care is rare.",
    name: "Priya Nair",
    role: "Weekend Explorer",
  },
];

const Home = () => {
  return (
    <div className="dcr-page">
      <Navbar />

      {/* ================= HERO ================= */}
      <header id="home" className="dcr-hero">
        <div className="container">
          <div className="row align-items-center gy-5">
            <div className="col-lg-6">
              <span className="dcr-eyebrow">Premium Fleet · Effortless Booking</span>
              <h1 className="dcr-hero-title">
                Drive the <span>Extraordinary</span>.
              </h1>
              <p className="dcr-hero-sub">
                From weekend getaways to boardroom arrivals, Demo Car Rental puts a
                meticulously maintained fleet at your fingertips — booked in minutes,
                ready in hours.
              </p>
              <div className="dcr-hero-actions">
                <a href="#booking" className="btn dcr-btn-gold-lg">
                  Book a Car
                </a>
                <a href="#inventory" className="btn dcr-btn-outline-lg">
                  View Fleet
                </a>
              </div>

              <div className="dcr-hero-stats">
                <div>
                  <strong>500+</strong>
                  <span>Vehicles</span>
                </div>
                <div>
                  <strong>50+</strong>
                  <span>Cities</span>
                </div>
                <div>
                  <strong>24/7</strong>
                  <span>Support</span>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="dcr-hero-visual">
                <img
                  className="dcr-hero-photo dcr-hero-photo--1"
                  src="https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80"
                  alt="Luxury sedan available for rent"
                />
                <img
                  className="dcr-hero-photo dcr-hero-photo--2"
                  src="https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=800&q=80"
                  alt="Sports car available for rent"
                />
                <img
                  className="dcr-hero-photo dcr-hero-photo--3"
                  src="https://images.unsplash.com/photo-1568844293986-8d0400bd4745?auto=format&fit=crop&w=800&q=80"
                  alt="SUV available for rent"
                />

                {/* Signature animation: a car drives along an endless dashed road */}
                <div className="dcr-road" aria-hidden="true">
                  <span className="dcr-road-line"></span>
                  <svg className="dcr-road-car" viewBox="0 0 64 40" width="42" height="26">
                    <path
                      d="M6 26 L10 13 Q12 7 20 7 H40 Q48 7 50 13 L54 26 V33 Q54 36 51 36 H47
                         Q44 36 44 33 V31 H16 V33 Q16 36 13 36 H9 Q6 36 6 33 Z"
                      fill="#14213D"
                    />
                    <circle cx="16" cy="33" r="5.5" fill="#0c1730" />
                    <circle cx="44" cy="33" r="5.5" fill="#0c1730" />
                    <rect x="17" y="13" width="26" height="9" rx="2.5" fill="#FAF9F6" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ================= WHY CHOOSE US (separate component) ================= */}
      <HighlightCards />

      {/* ================= FEATURED FLEET ================= */}
      <section id="inventory" className="dcr-fleet">
        <div className="container">
          <div className="d-flex flex-wrap justify-content-between align-items-end mb-4 gap-3">
            <div>
              <span className="dcr-eyebrow">Featured Fleet</span>
              <h2 className="dcr-section-title">Handpicked for every kind of drive</h2>
            </div>
            <a href="#inventory" className="dcr-link-gold">
              View full inventory &rarr;
            </a>
          </div>

          <div className="row g-4">
            {fleet.map((car) => (
              <div className="col-sm-6 col-lg-3" key={car.name}>
                <div className="dcr-fleet-card">
                  <div className="dcr-fleet-img-wrap">
                    <img src={car.img} alt={car.name} />
                    <span className="dcr-fleet-tag">{car.type}</span>
                  </div>
                  <div className="dcr-fleet-body">
                    <h3>{car.name}</h3>
                    <p className="dcr-fleet-specs">
                      {car.seats} &bull; {car.gearbox}
                    </p>
                    <div className="dcr-fleet-footer">
                      <span className="dcr-fleet-price">
                        {car.price}
                        <small>/day</small>
                      </span>
                      <a href="#booking" className="btn dcr-btn-outline-sm">
                        Reserve
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= OUR SERVICES ================= */}
      <section id="services" className="dcr-services">
        <div className="container">
          <div className="text-center dcr-section-heading">
            <span className="dcr-eyebrow">Our Services</span>
            <h2>Beyond the standard rental</h2>
            <p className="dcr-section-sub">
              Tailored options for travelers, teams, and everything in between.
            </p>
          </div>

          <div className="row g-4 mt-2">
            {services.map((s) => (
              <div className="col-sm-6 col-lg-3" key={s.title}>
                <div className="dcr-service-card">
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="dcr-process">
        <div className="container">
          <div className="text-center dcr-section-heading dcr-section-heading--light">
            <span className="dcr-eyebrow dcr-eyebrow--light">How It Works</span>
            <h2>Three steps to the open road</h2>
          </div>

          <div className="row g-4 mt-2">
            {steps.map((step, i) => (
              <div className="col-md-4" key={step.n}>
                <div className="dcr-step">
                  <span className="dcr-step-num">{step.n}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                  {i < steps.length - 1 && <span className="dcr-step-connector" aria-hidden="true"></span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="dcr-testimonials">
        <div className="container">
          <div className="text-center dcr-section-heading">
            <span className="dcr-eyebrow">Testimonials</span>
            <h2>Trusted by drivers everywhere</h2>
          </div>

          <div className="row g-4 mt-2">
            {testimonials.map((t) => (
              <div className="col-md-4" key={t.name}>
                <div className="dcr-testimonial-card">
                  <svg viewBox="0 0 32 24" width="30" className="dcr-quote-mark">
                    <path
                      d="M0 24V14.6C0 6.2 4.9.9 12.6 0l1 3.6c-4.7 1-7.2 3.7-7.5 8.1H12v12.3H0zm18 0V14.6C18 6.2 22.9.9 30.6 0l1 3.6c-4.7 1-7.2 3.7-7.5 8.1H30v12.3H18z"
                      fill="currentColor"
                    />
                  </svg>
                  <p>{t.quote}</p>
                  <div className="dcr-testimonial-name">{t.name}</div>
                  <div className="dcr-testimonial-role">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA BANNER ================= */}
      <section id="booking" className="dcr-cta">
        <div className="container text-center">
          <h2>Ready to hit the road?</h2>
          <p>Reserve your car in under two minutes — no deposit required at booking.</p>
          <a href="#inventory" className="btn dcr-btn-gold-lg">
            Browse the Fleet
          </a>
        </div>
      </section>

      {/* ================= FOOTER / CONTACT ================= */}
      <footer id="contact" className="dcr-footer">
        <div className="container">
          <div className="row gy-4">
            <div className="col-lg-4">
              <div className="dcr-brand dcr-brand--footer">
                <span className="dcr-brand-icon" aria-hidden="true">
                  <svg viewBox="0 0 64 40" width="32" height="32">
                    <path
                      d="M6 26 L10 13 Q12 7 20 7 H40 Q48 7 50 13 L54 26 V33 Q54 36 51 36 H47
                         Q44 36 44 33 V31 H16 V33 Q16 36 13 36 H9 Q6 36 6 33 Z"
                      fill="currentColor"
                    />
                    <circle cx="16" cy="33" r="5.5" fill="#14213D" />
                    <circle cx="44" cy="33" r="5.5" fill="#14213D" />
                  </svg>
                </span>
                <span className="dcr-brand-text">
                  Demo <strong>Car Rental</strong>
                </span>
              </div>
              <p className="dcr-footer-about">
                A demo rental platform built to showcase a light, professional
                car-rental homepage experience.
              </p>
            </div>

            <div className="col-6 col-lg-2">
              <h4>Explore</h4>
              <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#inventory">Inventory</a></li>
                <li><a href="#services">Our Services</a></li>
                <li><a href="#contact">Contact Us</a></li>
              </ul>
            </div>

            <div className="col-6 col-lg-2">
              <h4>Company</h4>
              <ul>
                <li><a href="#about">About Us</a></li>
                <li><a href="#careers">Careers</a></li>
                <li><a href="#terms">Terms</a></li>
                <li><a href="#privacy">Privacy</a></li>
              </ul>
            </div>

            <div className="col-lg-4">
              <h4>Stay in the loop</h4>
              <p className="dcr-footer-about">Fleet updates and seasonal offers, monthly.</p>
              <form className="dcr-newsletter" onSubmit={(e) => e.preventDefault()}>
                <input type="email" placeholder="you@example.com" aria-label="Email address" />
                <button type="submit" className="btn dcr-btn-gold">Subscribe</button>
              </form>
            </div>
          </div>

          <div className="dcr-footer-bottom">
            <span>&copy; {new Date().getFullYear()} Demo Car Rental. All rights reserved.</span>
            <div className="dcr-social">
              <a href="#" aria-label="Facebook">FB</a>
              <a href="#" aria-label="Instagram">IG</a>
              <a href="#" aria-label="X">X</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
