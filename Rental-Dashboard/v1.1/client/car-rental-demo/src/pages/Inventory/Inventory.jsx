import React, { useMemo, useState, useEffect } from "react";
import api, {base_url} from "../../api.jsx";
import Navbar from "../../components/NavBar/NavBar.jsx";
import Filter, { emptyFilters } from "../../components/Filter/Filter.jsx";
import { useNavigate } from "react-router-dom";
import "./Inventory.css";

const Inventory = () => {
  const [CARS, setCARS] = useState([]); // <-- default to empty array, not null
  const [loading, setLoading] = useState(true); // <-- was missing entirely
  const [filters, setFilters] = useState(emptyFilters);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/stocks/all');
        setCARS(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStocks();
  }, []);

  const brands = useMemo(
    () => Array.from(new Set(CARS.map((c) => c.brand))).sort(),
    [CARS] // <-- was missing CARS as a dependency, so it never recalculated after fetch
  );

  const filteredCars = useMemo(() => {
    const q = filters.search.trim().toLowerCase();

    return CARS.filter((car) => {
      if (q && !`${car.brand} ${car.name}`.toLowerCase().includes(q)) return false;

      if (filters.fuelTypes.length && !filters.fuelTypes.includes(car.fuel_type)) {
        return false;
      }

      if (filters.availability === "available" && car.status !== "Available") return false;
      if (filters.availability === "rented" && car.status !== "Rented") return false;

      if (filters.expiryWindow !== "any") {
        if (car.status !== "Rented") return false;
        if (car.days_left > Number(filters.expiryWindow)) return false;
      }

      if (filters.brands.length && !filters.brands.includes(car.brand)) return false;

      return true;
    });
  }, [filters, CARS]); // <-- also needs CARS here

  if (loading) {
    return (
      <div className="dcr-page dcr-inventory-page">
        <Navbar />
        <p>Loading inventory...</p>
      </div>
    );
  }

  return (
    <div className="dcr-page dcr-inventory-page">
      <Navbar />

      <header className="dcr-inv-banner">
        <div className="container">
          <span className="dcr-eyebrow dcr-eyebrow--light">Fleet Inventory</span>
          <h1>Every vehicle, ready when you are</h1>
        </div>
      </header>

      <section className="dcr-inv-body">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-3">
              <Filter
                filters={filters}
                setFilters={setFilters}
                brands={brands}
                resultCount={filteredCars.length}
              />
            </div>

            <div className="col-lg-9">
              <div className="dcr-inv-toolbar">
                <p className="dcr-inv-count">
                  Showing <strong>{filteredCars.length}</strong> of {CARS.length} vehicles
                </p>
              </div>

              {filteredCars.length > 0 ? (
                <div className="row row-cols-1 row-cols-sm-2 row-cols-xl-3 g-4">
                  {filteredCars.map((car) => (
                    <div className="col" key={car.id}>
                      <div className="dcr-inv-card">
                        <div className="dcr-inv-img-wrap">
                          <img src={`${base_url}public${car.img[0]}`} alt={car.name} loading="lazy" />
                          <span className="dcr-inv-type-tag">{car.type}</span>
                          {car.status === "Available" ? (
                            <span className="dcr-status-badge dcr-status-badge--available">
                              <i /> Available
                            </span>
                          ) : (
                            <span className="dcr-status-badge dcr-status-badge--rented">
                              <i /> Rented &middot; {car.days_left}d left
                            </span>
                          )}
                        </div>

                        <div className="dcr-inv-card-body">
                          <div className="dcr-inv-card-heading">
                            <h3>{car.name}</h3>
                            <span className="dcr-inv-brand">{car.brand}</span>
                          </div>

                          <ul className="dcr-inv-specs">
                            <li>{car.fuel_type}</li>
                            <li>{car.seats} Seats</li>
                            <li>{car.gearbox}</li>
                          </ul>

                          <div className="dcr-inv-footer">
                            <span className="dcr-inv-price">
                              ${car.price}
                              <small>/day</small>
                            </span>
                            <button
                              type="button"
                              className="btn dcr-btn-outline-sm"
                              disabled={car.status === "Rented"}
                              onClick={() => navigate(`/inventory/${car.id}`, { state: { car } })}
                            >
                              {car.status === "Rented" ? "Unavailable" : "Reserve"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="dcr-inv-empty">
                  <svg viewBox="0 0 64 64" width="48" height="48" aria-hidden="true">
                    <circle cx="32" cy="32" r="26" fill="none" stroke="currentColor" strokeWidth="2.4" />
                    <path d="M22 22l20 20M42 22l-20 20" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                  </svg>
                  <h3>No vehicles match your filters</h3>
                  <p>Try widening your search or clearing a few filters.</p>
                  <button
                    type="button"
                    className="btn dcr-btn-outline-lg"
                    onClick={() => setFilters(emptyFilters)}
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Inventory;