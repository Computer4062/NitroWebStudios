import React from "react";
import Navbar from "../../components/NavBar/NavBar.jsx";
import "./Services.css";

/* ---------------------------------------------------------------------- */
/* Image pool — mixes the car photos already used elsewhere in the app    */
/* (known to render) with a few themed shots (airport, chauffeur,         */
/* corporate) for variety. Swap any of these for your own assets.         */
/* ---------------------------------------------------------------------- */
const IMG = {
  heroBg: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1600&q=80",
  airportMain: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=900&q=80",
  airportSide1: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=500&q=80",
  airportSide2: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=500&q=80",
  chauffeurMain: "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=900&q=80",
  chauffeurSide1: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=500&q=80",
  chauffeurSide2: "https://images.unsplash.com/photo-1554744512-d6c603f27c54?auto=format&fit=crop&w=500&q=80",
  leaseMain: "https://images.unsplash.com/photo-1568844293986-8d0400bd4745?auto=format&fit=crop&w=900&q=80",
  leaseSide1: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=500&q=80",
  leaseSide2: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=500&q=80",
  corpMain: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=900&q=80",
  corpSide1: "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?auto=format&fit=crop&w=500&q=80",
  corpSide2: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=500&q=80",
  ctaBg: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1600&q=80",
};

const SERVICES = [
  {
    id: "airport",
    eyebrow: "Airport Transfers",
    title: "Airport Pickup & Drop",
    text:
      "Land, collect your bags, and your car is already waiting at the curb. Our airport team tracks live flight data, so pickups adjust automatically for early arrivals or delays — no calls needed.",
    features: [
      "Live flight tracking, no matter the delay",
      "Meet-and-greet at arrivals with a name board",
      "Free 60-minute wait time included",
      "Available at 40+ airports worldwide",
    ],
    main: IMG.airportMain,
    side1: IMG.airportSide1,
    side2: IMG.airportSide2,
  },
  {
    id: "chauffeur",
    eyebrow: "Chauffeur Service",
    title: "Chauffeur Driven",
    text:
      "Sit back and let a licensed professional take the wheel. Ideal for business trips, events, or evenings out — every chauffeur is background-checked, uniformed, and trained in defensive driving.",
    features: [
      "Vetted, licensed, and insured chauffeurs",
      "Hourly, half-day, and full-day packages",
      "Bottled water and Wi-Fi on every ride",
      "Multilingual drivers available on request",
    ],
    main: IMG.chauffeurMain,
    side1: IMG.chauffeurSide1,
    side2: IMG.chauffeurSide2,
  },
  {
    id: "leasing",
    eyebrow: "Extended Rentals",
    title: "Long-Term Leasing",
    text:
      "Relocating, on a long project, or just tired of ride-hailing surge pricing? Our monthly leases include maintenance and roadside cover, with the flexibility to swap vehicles as your needs change.",
    features: [
      "Monthly plans from 1 to 12 months",
      "Scheduled maintenance included at no extra cost",
      "Swap vehicle classes with 48 hours' notice",
      "Mileage packages tailored to your routine",
    ],
    main: IMG.leaseMain,
    side1: IMG.leaseSide1,
    side2: IMG.leaseSide2,
  },
  {
    id: "corporate",
    eyebrow: "Business Accounts",
    title: "Corporate Accounts",
    text:
      "One centralized account for your whole team. Set spending limits by department, get consolidated monthly invoicing, and give employees priority access to the fleet — all through one dashboard.",
    features: [
      "Centralized billing with monthly statements",
      "Role-based booking limits and approvals",
      "Priority fleet access for account members",
      "Dedicated account manager for your company",
    ],
    main: IMG.corpMain,
    side1: IMG.corpSide1,
    side2: IMG.corpSide2,
  },
];

const WHY_US = [
  {
    title: "Vetted Professionals",
    text: "Every chauffeur and support agent is background-checked and trained.",
  },
  {
    title: "Transparent Pricing",
    text: "One quoted rate, no surprise fees added at pickup or drop-off.",
  },
  {
    title: "Flexible Terms",
    text: "Scale services up or down as your travel or business needs shift.",
  },
  {
    title: "Always Reachable",
    text: "A dedicated line for every service, staffed around the clock.",
  },
];

const Services = () => {
  return (
    <div className="dcr-page dcr-services-page">
      <Navbar />

      {/* Hero banner with background image */}
      <header
        className="dcr-services-hero"
        style={{ backgroundImage: `url(${IMG.heroBg})` }}
      >
        <div className="dcr-services-hero-overlay" />
        <div className="container dcr-services-hero-content">
          <span className="dcr-eyebrow dcr-eyebrow--light">Our Services</span>
          <h1>More than a rental — a complete travel solution</h1>
          <p>
            From a single airport transfer to a fleet for your whole company, we tailor the
            service to fit the trip.
          </p>
        </div>
      </header>

      {/* Alternating service blocks */}
      <section className="dcr-services-list">
        <div className="container">
          {SERVICES.map((s, i) => (
            <div
              className={`dcr-service-block ${i % 2 === 1 ? "dcr-service-block--reverse" : ""}`}
              key={s.id}
              id={s.id}
            >
              <div className="dcr-service-media">
                <div className="dcr-service-media-main">
                  <img src={s.main} alt={s.title} loading="lazy" />
                </div>
                <div className="dcr-service-media-side">
                  <img src={s.side1} alt="" loading="lazy" />
                  <img src={s.side2} alt="" loading="lazy" />
                </div>
              </div>

              <div className="dcr-service-content">
                <span className="dcr-eyebrow">{s.eyebrow}</span>
                <h2>{s.title}</h2>
                <p>{s.text}</p>
                <ul className="dcr-service-features">
                  {s.features.map((f) => (
                    <li key={f}>
                      <svg viewBox="0 0 14 11" width="13" height="10">
                        <path
                          d="M1 5.5l3.8 3.8L13 1"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <a href="#contact" className="btn dcr-btn-outline-lg">
                  Get a Quote
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why choose our services */}
      <section className="dcr-services-why">
        <div className="container">
          <div className="text-center dcr-section-heading">
            <span className="dcr-eyebrow">The Difference</span>
            <h2>Why book a service with us</h2>
          </div>

          <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4 mt-2">
            {WHY_US.map((item) => (
              <div className="col" key={item.title}>
                <div className="dcr-why-card">
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA with background image */}
      <section
        className="dcr-services-cta"
        style={{ backgroundImage: `url(${IMG.ctaBg})` }}
      >
        <div className="dcr-services-cta-overlay" />
        <div className="container text-center dcr-services-cta-content">
          <h2>Ready to book your next ride?</h2>
          <p>Tell us what you need — we&apos;ll match you with the right service and vehicle.</p>
          <a href="/contacts" className="btn dcr-btn-gold-lg">
            Contact Our Team
          </a>
        </div>
      </section>
    </div>
  );
};

export default Services;