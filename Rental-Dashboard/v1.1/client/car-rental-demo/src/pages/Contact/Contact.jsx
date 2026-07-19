import React, { useState } from "react";
import Navbar from "../../components/NavBar/NavBar.jsx";
import "./Contact.css";

/* ---------------------------------------------------------------------- */
/* Demo data — swap for real branch data / a CMS response in production.  */
/* Map embeds use the key-less Google Maps "q=" embed format, so no API   */
/* key is required to render them.                                        */
/* ---------------------------------------------------------------------- */
const GENERAL_CONTACT = {
  emails: [
    { label: "General Support", value: "support@democarrental.com" },
    { label: "Reservations", value: "reservations@democarrental.com" },
  ],
  phones: [
    { label: "Toll-Free (US)", value: "+1 (800) 555-0199" },
    { label: "Direct Line", value: "+1 (212) 555-0142" },
  ],
};

const LOCATIONS = [
  {
    id: "downtown",
    name: "Downtown New York",
    address: "350 5th Ave, New York, NY 10118, USA",
    phone: "+1 (212) 555-0142",
    email: "newyork@democarrental.com",
    hours: "Mon – Sun: 7:00 AM – 10:00 PM",
  },
  {
    id: "lax",
    name: "LAX Airport Branch",
    address: "1 World Way, Los Angeles, CA 90045, USA",
    phone: "+1 (310) 555-0188",
    email: "losangeles@democarrental.com",
    hours: "Open 24 hours",
  },
  {
    id: "miami",
    name: "Miami Beach Branch",
    address: "1100 Collins Ave, Miami Beach, FL 33139, USA",
    phone: "+1 (305) 555-0173",
    email: "miami@democarrental.com",
    hours: "Mon – Sun: 6:00 AM – 11:00 PM",
  },
];

const SUBJECTS = [
  "General Inquiry",
  "New Reservation",
  "Existing Booking",
  "Billing Question",
  "Feedback",
];

const mapEmbedUrl = (address) =>
  `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;

const emptyForm = { name: "", email: "", phone: "", subject: SUBJECTS[0], message: "" };

const Contact = () => {
  const [activeLocation, setActiveLocation] = useState(LOCATIONS[0].id);
  const [form, setForm] = useState(emptyForm);
  const [submitted, setSubmitted] = useState(false);

  const current = LOCATIONS.find((l) => l.id === activeLocation) || LOCATIONS[0];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Wire this up to your backend / email service.
    setSubmitted(true);
    setForm(emptyForm);
  };

  return (
    <div className="dcr-page dcr-contact-page">
      <Navbar />

      {/* Banner */}
      <header className="dcr-contact-banner">
        <div className="container">
          <span className="dcr-eyebrow dcr-eyebrow--light">Contact Us</span>
          <h1>We&apos;d love to hear from you</h1>
          <p>Reach our team directly, or stop by one of our branches — we&apos;re happy to help.</p>
        </div>
      </header>

      {/* Quick contact cards */}
      <section className="dcr-contact-quick">
        <div className="container">
          <div className="row g-4">
            <div className="col-md-6">
              <div className="dcr-quick-card">
                <div className="dcr-quick-icon">
                  <svg viewBox="0 0 24 20" width="22" height="18">
                    <rect x="1" y="1" width="22" height="18" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
                    <path d="M2 3l10 8 10-8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3>Email Us</h3>
                <ul>
                  {GENERAL_CONTACT.emails.map((e) => (
                    <li key={e.value}>
                      <span>{e.label}</span>
                      <a href={`mailto:${e.value}`}>{e.value}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="col-md-6">
              <div className="dcr-quick-card">
                <div className="dcr-quick-icon">
                  <svg viewBox="0 0 24 24" width="20" height="20">
                    <path
                      d="M6.6 10.8c1.4 2.7 3.6 4.9 6.3 6.3l2.1-2.1c.3-.3.7-.4 1.1-.2 1.2.4 2.4.6 3.7.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.7 21 3 13.3 3 4c0-.6.4-1 1-1h3.6c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.7.1.4 0 .8-.2 1.1z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <h3>Call Us</h3>
                <ul>
                  {GENERAL_CONTACT.phones.map((p) => (
                    <li key={p.value}>
                      <span>{p.label}</span>
                      <a href={`tel:${p.value.replace(/[^+\d]/g, "")}`}>{p.value}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Locations + form */}
      <section className="dcr-contact-main">
        <div className="container">
          <div className="row g-5">
            {/* Locations list */}
            <div className="col-lg-5">
              <span className="dcr-eyebrow">Business Locations</span>
              <h2 className="dcr-section-title">Visit a branch near you</h2>

              <div className="dcr-location-list">
                {LOCATIONS.map((loc) => (
                  <button
                    type="button"
                    key={loc.id}
                    className={`dcr-location-card ${
                      activeLocation === loc.id ? "dcr-location-card--active" : ""
                    }`}
                    onClick={() => setActiveLocation(loc.id)}
                  >
                    <div className="dcr-location-pin" aria-hidden="true">
                      <svg viewBox="0 0 24 30" width="18" height="22">
                        <path
                          d="M12 0C5.4 0 0 5.4 0 12c0 9 12 18 12 18s12-9 12-18c0-6.6-5.4-12-12-12z"
                          fill="currentColor"
                        />
                        <circle cx="12" cy="12" r="4.5" fill="#FAF9F6" />
                      </svg>
                    </div>
                    <div className="dcr-location-info">
                      <h3>{loc.name}</h3>
                      <p>{loc.address}</p>
                      <div className="dcr-location-meta">
                        <span>{loc.phone}</span>
                        <span>{loc.hours}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Form */}
            <div className="col-lg-7">
              <span className="dcr-eyebrow">Send a Message</span>
              <h2 className="dcr-section-title">Have a question? Ask away</h2>

              {submitted && (
                <div className="dcr-form-success" role="status">
                  <svg viewBox="0 0 14 11" width="14" height="11">
                    <path
                      d="M1 5.5l3.8 3.8L13 1"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Thanks — your message has been sent. We&apos;ll reply within 24 hours.
                </div>
              )}

              <form className="dcr-contact-form" onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-sm-6">
                    <label htmlFor="dcr-name">Full Name</label>
                    <input
                      id="dcr-name"
                      name="name"
                      type="text"
                      required
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div className="col-sm-6">
                    <label htmlFor="dcr-email">Email Address</label>
                    <input
                      id="dcr-email"
                      name="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                    />
                  </div>
                  <div className="col-sm-6">
                    <label htmlFor="dcr-phone">Phone Number (optional)</label>
                    <input
                      id="dcr-phone"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                  <div className="col-sm-6">
                    <label htmlFor="dcr-subject">Subject</label>
                    <select
                      id="dcr-subject"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                    >
                      {SUBJECTS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-12">
                    <label htmlFor="dcr-message">Message</label>
                    <textarea
                      id="dcr-message"
                      name="message"
                      rows={5}
                      required
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Tell us how we can help..."
                    />
                  </div>
                  <div className="col-12">
                    <button type="submit" className="btn dcr-btn-gold-lg">
                      Send Message
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="dcr-contact-map">
        <div className="container">
          <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
            <div>
              <span className="dcr-eyebrow">Find Us</span>
              <h2 className="dcr-section-title">{current.name}</h2>
            </div>

            <div className="dcr-map-tabs">
              {LOCATIONS.map((loc) => (
                <button
                  type="button"
                  key={loc.id}
                  className={`dcr-map-tab ${
                    activeLocation === loc.id ? "dcr-map-tab--active" : ""
                  }`}
                  onClick={() => setActiveLocation(loc.id)}
                >
                  {loc.name}
                </button>
              ))}
            </div>
          </div>

          <div className="dcr-map-frame">
            <iframe
              title={`Map showing ${current.name}`}
              src={mapEmbedUrl(current.address)}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>

          <div className="dcr-map-details">
            <div>
              <span className="dcr-spec-label">Address</span>
              <span className="dcr-spec-value">{current.address}</span>
            </div>
            <div>
              <span className="dcr-spec-label">Phone</span>
              <span className="dcr-spec-value">{current.phone}</span>
            </div>
            <div>
              <span className="dcr-spec-label">Email</span>
              <span className="dcr-spec-value">{current.email}</span>
            </div>
            <div>
              <span className="dcr-spec-label">Hours</span>
              <span className="dcr-spec-value">{current.hours}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;