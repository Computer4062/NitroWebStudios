import React from "react";
import "./HighlightCards.css";

/**
 * "Why riders choose us" highlight cards.
 * Pure presentational component — data lives in the `highlights` array
 * below so it's trivial to edit copy without touching markup.
 */
const highlights = [
  {
    title: "Wide Selection",
    text: "From city hatchbacks to executive SUVs, choose from over 500 well-maintained vehicles.",
    icon: (
      <svg viewBox="0 0 48 48" width="26" height="26">
        <path
          d="M6 30 L9 20 Q11 15 17 15 H31 Q37 15 39 20 L42 30 V35 Q42 37 40 37 H37
             Q35 37 35 35 V34 H13 V35 Q13 37 11 37 H8 Q6 37 6 35 Z"
          fill="currentColor"
        />
        <circle cx="14" cy="35" r="3.4" fill="#FAF9F6" />
        <circle cx="34" cy="35" r="3.4" fill="#FAF9F6" />
      </svg>
    ),
  },
  {
    title: "Best Price Guarantee",
    text: "Transparent daily rates with no hidden fees — find it cheaper and we'll match it.",
    icon: (
      <svg viewBox="0 0 48 48" width="26" height="26">
        <circle cx="24" cy="24" r="17" fill="none" stroke="currentColor" strokeWidth="2.6" />
        <path
          d="M24 15v18M19 19.5c0-2.5 2.2-4.5 5-4.5s5 2 5 4.5-2.2 3.5-5 4.5-5 2-5 4.5 2.2 4.5 5 4.5 5-2 5-4.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    title: "24/7 Roadside Support",
    text: "A dedicated helpline and rapid response team, wherever your trip takes you.",
    icon: (
      <svg viewBox="0 0 48 48" width="26" height="26">
        <path
          d="M24 6c-8.8 0-16 7.2-16 16v10a5 5 0 0 0 5 5h3v-13h-4v-2c0-6.6 5.4-12 12-12s12 5.4 12 12v2h-4v13h3a5 5 0 0 0 5-5V22c0-8.8-7.2-16-16-16z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    title: "Flexible Cancellation",
    text: "Plans change. Cancel free of charge up to 24 hours before your pickup time.",
    icon: (
      <svg viewBox="0 0 48 48" width="26" height="26">
        <rect x="8" y="10" width="32" height="28" rx="3" fill="none" stroke="currentColor" strokeWidth="2.6" />
        <path d="M8 18h32" stroke="currentColor" strokeWidth="2.6" />
        <path d="M18 27l4 4 8-8" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Full Insurance Coverage",
    text: "Every rental includes comprehensive cover, so you can drive with total peace of mind.",
    icon: (
      <svg viewBox="0 0 48 48" width="26" height="26">
        <path
          d="M24 5 8 11v11c0 10.5 6.8 17.7 16 21 9.2-3.3 16-10.5 16-21V11z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinejoin="round"
        />
        <path d="M17 24l5 5 9-10" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Instant Online Booking",
    text: "Reserve in under two minutes and get an e-confirmation on the spot — no paperwork.",
    icon: (
      <svg viewBox="0 0 48 48" width="26" height="26">
        <rect x="9" y="6" width="30" height="36" rx="3" fill="none" stroke="currentColor" strokeWidth="2.6" />
        <path d="M16 15h16M16 22h16M16 29h10" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      </svg>
    ),
  },
];

const HighlightCards = () => {
  return (
    <section className="dcr-highlights">
      <div className="container">
        <div className="text-center dcr-section-heading">
          <span className="dcr-eyebrow">The Demo Difference</span>
          <h2>Why riders choose us</h2>
          <p className="dcr-section-sub">
            Every reservation comes standard with the details that matter most.
          </p>
        </div>

        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mt-2">
          {highlights.map((item) => (
            <div className="col" key={item.title}>
              <div className="dcr-card h-100">
                <div className="dcr-card-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HighlightCards;