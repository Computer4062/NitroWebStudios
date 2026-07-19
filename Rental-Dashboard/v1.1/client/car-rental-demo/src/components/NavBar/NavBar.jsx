import React, { useState, useEffect } from "react";
import "./Navbar.css";

/**
 * Site navigation bar for Demo Car Rental.
 * - Turns solid/shadowed once the page is scrolled
 * - Collapses into a hamburger menu on small screens (Bootstrap collapse)
 */
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Inventory", href: "/inventory" },
    { label: "Our Services", href: "/services" },
    { label: "Contact Us", href: "/contacts" },
  ];

  return (
    <nav
      className={`navbar navbar-expand-lg dcr-navbar sticky-top ${
        scrolled ? "dcr-navbar--scrolled" : ""
      }`}
    >
      <div className="container">
        {/* Logo */}
        <a className="navbar-brand dcr-brand" href="#home">
          <span className="dcr-brand-icon" aria-hidden="true">
            <svg viewBox="0 0 64 40" width="36" height="36">
              <path
                d="M6 26 L10 13 Q12 7 20 7 H40 Q48 7 50 13 L54 26 V33 Q54 36 51 36 H47
                   Q44 36 44 33 V31 H16 V33 Q16 36 13 36 H9 Q6 36 6 33 Z"
                fill="currentColor"
              />
              <circle cx="16" cy="33" r="5.5" fill="#14213D" />
              <circle cx="44" cy="33" r="5.5" fill="#14213D" />
              <circle cx="16" cy="33" r="2" fill="#C6A15B" />
              <circle cx="44" cy="33" r="2" fill="#C6A15B" />
              <rect x="17" y="13" width="26" height="9" rx="2.5" fill="#FAF9F6" />
            </svg>
          </span>
          <span className="dcr-brand-text">
            Demo <strong>Car&nbsp;Rental</strong>
          </span>
        </a>

        {/* Mobile toggler */}
        <button
          className="navbar-toggler"
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={expanded}
          onClick={() => setExpanded((v) => !v)}
        >
          <span className="navbar-toggler-icon" />
        </button>

        {/* Links */}
        <div className={`collapse navbar-collapse ${expanded ? "show" : ""}`}>
          <ul className="navbar-nav ms-auto align-items-lg-center dcr-nav-list">
            {navLinks.map((link) => (
              <li className="nav-item" key={link.label}>
                <a className="nav-link" href={link.href} onClick={() => setExpanded(false)}>
                  {link.label}
                </a>
              </li>
            ))}
            <li className="nav-item ms-lg-3 mt-2 mt-lg-0">
              <a href="/booking" className="btn dcr-btn-gold">
                Book Now
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;