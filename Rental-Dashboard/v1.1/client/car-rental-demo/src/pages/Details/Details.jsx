import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../api.jsx";
import Navbar from "../../components/NavBar/NavBar.jsx";
import "./Details.css";
import { base_url } from "../../api.jsx";

// --------------------------------------------------------
import { io } from "socket.io-client";

let sessionId = sessionStorage.getItem('analytics_session_id');
if (!sessionId) {
  sessionId = 'sess_' + Math.random().toString(36).substring(2, 15);
  sessionStorage.setItem('analytics_session_id', sessionId);
}

const socket = io(base_url, {
  auth: { sessionId }
});
// --------------------------------------------------------

/* ------------------------------------------------------------------ */
/* Gallery — main image + thumbnail strip + full-screen lightbox.      */
/* ------------------------------------------------------------------ */
const Gallery = ({ images, alt }) => {
  const location = useLocation();

	useEffect(() => {
		const currentPath = location.pathname;

		if (socket.connected) {
		socket.emit('page_view', { pagePath: currentPath });
		} else {
		socket.once('connect', () => {
			socket.emit('page_view', { pagePath: currentPath });
		});
		}

	}, [location]);

  const [active, setActive] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const goPrev = () => setActive((i) => (i === 0 ? images.length - 1 : i - 1));
  const goNext = () => setActive((i) => (i === images.length - 1 ? 0 : i + 1));

  useEffect(() => {
    if (!lightboxOpen) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightboxOpen, images.length]);

  return (
    <div className="dcr-gallery">
      <div className="dcr-gallery-main">
        <button type="button" className="dcr-gallery-nav dcr-gallery-nav--prev" onClick={goPrev} aria-label="Previous image">
          &#8249;
        </button>

        <img
          src={images[active]}
          alt={`${alt} — view ${active + 1} of ${images.length}`}
          className="dcr-gallery-main-img"
          onClick={() => setLightboxOpen(true)}
        />

        <button type="button" className="dcr-gallery-nav dcr-gallery-nav--next" onClick={goNext} aria-label="Next image">
          &#8250;
        </button>

        <span className="dcr-gallery-counter">
          {active + 1} / {images.length}
        </span>

        <button type="button" className="dcr-gallery-expand" onClick={() => setLightboxOpen(true)} aria-label="View full screen">
          <svg viewBox="0 0 20 20" width="15" height="15">
            <path d="M2 7V3h4M18 7V3h-4M2 13v4h4M18 13v4h-4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <div className="dcr-gallery-thumbs">
        {images.map((src, i) => (
          <button
            type="button"
            key={src + i}
            className={`dcr-gallery-thumb ${i === active ? "dcr-gallery-thumb--active" : ""}`}
            onClick={() => setActive(i)}
            aria-label={`Show image ${i + 1}`}
          >
            <img src={src} alt="" />
          </button>
        ))}
      </div>

      {lightboxOpen && (
        <div className="dcr-lightbox" onClick={() => setLightboxOpen(false)}>
          <button type="button" className="dcr-lightbox-close" onClick={() => setLightboxOpen(false)} aria-label="Close full screen view">
            &times;
          </button>

          <button type="button" className="dcr-lightbox-nav dcr-lightbox-nav--prev" onClick={(e) => { e.stopPropagation(); goPrev(); }} aria-label="Previous image">
            &#8249;
          </button>

          <img
            src={images[active]}
            alt={`${alt} — full screen view ${active + 1} of ${images.length}`}
            className="dcr-lightbox-img"
            onClick={(e) => e.stopPropagation()}
          />

          <button type="button" className="dcr-lightbox-nav dcr-lightbox-nav--next" onClick={(e) => { e.stopPropagation(); goNext(); }} aria-label="Next image">
            &#8250;
          </button>

          <span className="dcr-lightbox-counter">
            {active + 1} / {images.length}
          </span>
        </div>
      )}
    </div>
  );
};

/**
 * Details page for a single car.
 * Uses the current URL pathname (e.g. "/inventory/5") directly, and fetches
 * both the vehicle's own details AND its related cars in a single backend call.
 */
const Details = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState(null);
  const [CARS, setCARS] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Single fetch: pass the current pathname straight to the backend,
  // which extracts the ID and returns { vehicle, related } together
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        setNotFound(false);

        const response = await api.get('/api/stocks/details-by-path', {
          params: { path: location.pathname }
        });

        setVehicle(response.data.vehicle);
        setCARS(response.data.related || []);

      } catch (error) {
        console.error("Failed to fetch vehicle details:", error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [location.pathname]);

  // IMG_POOL: gallery images for the selected vehicle, built from its own img JSON array
  const IMG_POOL = useMemo(() => {
    if (!vehicle || !vehicle.img) return [];

    let imgArray = vehicle.img;

    if (typeof imgArray === 'string') {
      try {
        imgArray = JSON.parse(imgArray);
      } catch (e) {
        return [];
      }
    }

    if (!Array.isArray(imgArray) || imgArray.length === 0) return [];

    return imgArray.map((imgPath) => `${base_url}public${imgPath}`);
  }, [vehicle]);

  const highlights = [
    "Unlimited mileage",
    "Comprehensive insurance included",
    "Free cancellation up to 24h before pickup",
    "24/7 roadside assistance",
  ];

  if (loading) {
    return (
      <div className="dcr-page dcr-details-page">
        <Navbar />
        <p>Loading vehicle...</p>
      </div>
    );
  }

  if (notFound || !vehicle) {
    return (
      <div className="dcr-page dcr-details-page">
        <Navbar />
        <div className="dcr-inv-empty">
          <h3>Vehicle not found</h3>
          <p>This listing may have been removed or the link is incorrect.</p>
          <button type="button" className="btn dcr-btn-outline-lg" onClick={() => navigate("/inventory")}>
            Back to Inventory
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dcr-page dcr-details-page">
      <Navbar />

      {/* Breadcrumb */}
      <div className="dcr-details-breadcrumb">
        <div className="container">
          <a href="#home">Home</a>
          <span>/</span>
          <a href="#inventory">Inventory</a>
          <span>/</span>
          <strong>{vehicle.name}</strong>
        </div>
      </div>

      <section className="dcr-details-body">
        <div className="container">
          <div className="row g-5">
            {/* Gallery */}
            <div className="col-lg-7">
              {IMG_POOL.length > 0 && <Gallery images={IMG_POOL} alt={`${vehicle.brand} ${vehicle.name}`} />}
            </div>

            {/* Info panel */}
            <div className="col-lg-5">
              <div className="dcr-details-panel">
                <div className="dcr-details-top">
                  <span className="dcr-details-brand">{vehicle.brand}</span>
                  {vehicle.status === "Available" ? (
                    <span className="dcr-status-badge dcr-status-badge--available">
                      <i /> Available Now
                    </span>
                  ) : (
                    <span className="dcr-status-badge dcr-status-badge--rented">
                      <i /> Rented &middot; {vehicle.days_left}d left
                    </span>
                  )}
                </div>

                <h1 className="dcr-details-title">{vehicle.name}</h1>

                <div className="dcr-details-price-row">
                  <span className="dcr-details-price">
                    ${vehicle.price}
                    <small>/day</small>
                  </span>
                  <span className="dcr-details-type-tag">{vehicle.type}</span>
                </div>

                <div className="dcr-details-specs">
                  <div>
                    <span className="dcr-spec-label">Fuel Type</span>
                    <span className="dcr-spec-value">{vehicle.fuel_type}</span>
                  </div>
                  <div>
                    <span className="dcr-spec-label">Seats</span>
                    <span className="dcr-spec-value">{vehicle.seats}</span>
                  </div>
                  <div>
                    <span className="dcr-spec-label">Transmission</span>
                    <span className="dcr-spec-value">{vehicle.gearbox}</span>
                  </div>
                </div>

                <div className="dcr-details-actions">
                  <button type="button" className="btn dcr-btn-gold-lg" disabled={vehicle.status !== "Available"}>
                    {vehicle.status === "Available" ? "Reserve This Car" : "Currently Unavailable"}
                  </button>
                  <button type="button" className="btn dcr-btn-outline-lg">
                    Contact Us
                  </button>
                </div>

                <h2 className="dcr-details-subheading">What&apos;s Included</h2>
                <ul className="dcr-details-highlights">
                  {highlights.map((h) => (
                    <li key={h}>
                      <svg viewBox="0 0 14 11" width="13" height="10">
                        <path d="M1 5.5l3.8 3.8L13 1" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Related vehicles (CARS) */}
          {CARS.length > 0 && (
            <div className="dcr-details-related">
              <h2 className="dcr-section-title">You May Also Like</h2>
              <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4">
                {CARS.map((c) => (
                  <div className="col" key={c.id}>
                    <div
                      className="dcr-related-card"
                      onClick={() => navigate(`/inventory/${c.id}`)}
                      style={{ cursor: "pointer" }}
                    >
                      <img src={c.img && Array.isArray(c.img) && c.img[0] ? `${base_url}public${c.img[0]}` : ""} alt={c.name} />
                      <div className="dcr-related-body">
                        <h3>{c.name}</h3>
                        <p>{c.brand} &bull; {c.type}</p>
                        <span className="dcr-related-price">
                          ${c.price}
                          <small>/day</small>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Details;