import React, { useState } from "react";
import "./Filter.css";

/**
 * Controlled filter panel for the inventory grid.
 *
 * Props:
 *  - filters: { search, fuelTypes: [], availability, expiryWindow, brands: [] }
 *  - setFilters: React state setter for the filters object above
 *  - brands: string[] — full list of available brands to render as checkboxes
 *  - resultCount: number — how many cars currently match (shown on mobile CTA)
 */
const FUEL_OPTIONS = ["Electric", "Petrol/Diesel"];
const AVAILABILITY_OPTIONS = [
  { value: "all", label: "All" },
  { value: "available", label: "Not Rented" },
  { value: "rented", label: "Rented" },
];
const EXPIRY_OPTIONS = [
  { value: "any", label: "Any time" },
  { value: "3", label: "Within 3 days" },
  { value: "7", label: "Within 7 days" },
  { value: "14", label: "Within 14 days" },
  { value: "30", label: "Within 30 days" },
];

const emptyFilters = {
  search: "",
  fuelTypes: [],
  availability: "all",
  expiryWindow: "any",
  brands: [],
};

const Filter = ({ filters, setFilters, brands = [], resultCount = 0 }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleInArray = (key, value) => {
    setFilters((prev) => {
      const set = new Set(prev[key]);
      set.has(value) ? set.delete(value) : set.add(value);
      return { ...prev, [key]: Array.from(set) };
    });
  };

  const activeCount =
    filters.fuelTypes.length +
    filters.brands.length +
    (filters.availability !== "all" ? 1 : 0) +
    (filters.expiryWindow !== "any" ? 1 : 0) +
    (filters.search.trim() ? 1 : 0);

  const clearAll = () => setFilters(emptyFilters);

  return (
    <>
      {/* Mobile trigger */}
      <button
        type="button"
        className="dcr-filter-trigger d-lg-none"
        onClick={() => setMobileOpen(true)}
      >
        <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
          <path
            d="M2 4h16M5 10h10M8 16h4"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
        Filters
        {activeCount > 0 && <span className="dcr-filter-badge">{activeCount}</span>}
      </button>

      {/* Backdrop (mobile only) */}
      {mobileOpen && (
        <div className="dcr-filter-backdrop" onClick={() => setMobileOpen(false)} />
      )}

      <aside className={`dcr-filter-panel ${mobileOpen ? "dcr-filter-panel--open" : ""}`}>
        <div className="dcr-filter-panel-header">
          <h3>Filters</h3>
          <div className="dcr-filter-header-actions">
            {activeCount > 0 && (
              <button type="button" className="dcr-filter-clear" onClick={clearAll}>
                Clear all
              </button>
            )}
            <button
              type="button"
              className="dcr-filter-close d-lg-none"
              aria-label="Close filters"
              onClick={() => setMobileOpen(false)}
            >
              &times;
            </button>
          </div>
        </div>

        <div className="dcr-filter-scroll">
          {/* Search */}
          <div className="dcr-filter-group">
            <label className="dcr-filter-label" htmlFor="dcr-search">
              Search
            </label>
            <div className="dcr-search-box">
              <svg viewBox="0 0 20 20" width="15" height="15" aria-hidden="true">
                <circle cx="9" cy="9" r="6" fill="none" stroke="currentColor" strokeWidth="1.8" />
                <path d="M14 14l4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              <input
                id="dcr-search"
                type="text"
                placeholder="Search by model or brand..."
                value={filters.search}
                onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
              />
              {filters.search && (
                <button
                  type="button"
                  className="dcr-search-clear"
                  aria-label="Clear search"
                  onClick={() => setFilters((prev) => ({ ...prev, search: "" }))}
                >
                  &times;
                </button>
              )}
            </div>
          </div>

          {/* Fuel type */}
          <div className="dcr-filter-group">
            <span className="dcr-filter-label">Fuel Type</span>
            <div className="dcr-pill-group">
              {FUEL_OPTIONS.map((opt) => (
                <label className="dcr-pill" key={opt}>
                  <input
                    type="checkbox"
                    checked={filters.fuelTypes.includes(opt)}
                    onChange={() => toggleInArray("fuelTypes", opt)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div className="dcr-filter-group">
            <span className="dcr-filter-label">Availability</span>
            <div className="dcr-pill-group">
              {AVAILABILITY_OPTIONS.map((opt) => (
                <label className="dcr-pill" key={opt.value}>
                  <input
                    type="radio"
                    name="availability"
                    checked={filters.availability === opt.value}
                    onChange={() =>
                      setFilters((prev) => ({ ...prev, availability: opt.value }))
                    }
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Days till rent expires */}
          <div className="dcr-filter-group">
            <label className="dcr-filter-label" htmlFor="dcr-expiry">
              Rent Expiring In
            </label>
            <select
              id="dcr-expiry"
              className="dcr-select"
              value={filters.expiryWindow}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, expiryWindow: e.target.value }))
              }
            >
              {EXPIRY_OPTIONS.map((opt) => (
                <option value={opt.value} key={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <p className="dcr-filter-hint">Only applies to currently rented vehicles.</p>
          </div>

          {/* Brands */}
          <div className="dcr-filter-group">
            <span className="dcr-filter-label">Brands</span>
            <div className="dcr-checkbox-list">
              {brands.map((brand) => (
                <label className="dcr-checkbox-item" key={brand}>
                  <input
                    type="checkbox"
                    checked={filters.brands.includes(brand)}
                    onChange={() => toggleInArray("brands", brand)}
                  />
                  <span className="dcr-checkbox-box" aria-hidden="true">
                    <svg viewBox="0 0 12 10" width="10" height="9">
                      <path
                        d="M1 5l3 3 7-7"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  {brand}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile-only apply bar */}
        <div className="dcr-filter-mobile-actions d-lg-none">
          <button type="button" className="dcr-filter-clear-mobile" onClick={clearAll}>
            Clear all
          </button>
          <button
            type="button"
            className="btn dcr-btn-gold flex-grow-1"
            onClick={() => setMobileOpen(false)}
          >
            Show {resultCount} {resultCount === 1 ? "car" : "cars"}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Filter;
export { emptyFilters };