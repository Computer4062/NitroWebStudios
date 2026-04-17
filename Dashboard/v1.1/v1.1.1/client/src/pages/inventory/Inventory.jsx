import {useState, useEffect} from "react"

import NavBar from "../../components/navbar/NavBar.jsx"
import Footer from "../../components/footer/Footer.jsx"
import Search from "../../components/advanced-search/Search.jsx"
import Card from "../../components/card/Card.jsx"
import Ticker from '../../components/Ticker/Ticker'
import "./Inventory.css"

function Menu() {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/stocks/all')
      .then((response) => response.json())
      .then((data) => {
        setItems(data);
        setFilteredItems(data); // Initially show everything
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, []);

  useEffect(() => {
    const results = items.filter(item => 
      item.make.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredItems(results);
  }, [searchTerm, items]);

  return (
    <>

      <section>
        <NavBar/>
      </section>

      <section>
        <div class="container-fluid px-4 my-4">
        <div class="row g-5">
          
          <div className="col-md-5 col-lg-3 order-md-first">
            {/* MOBILE TOGGLE BUTTON - Only visible on small screens */}
            <button 
              className="btn btn-warning w-100 d-md-none mb-3 d-flex justify-content-between align-items-center" 
              type="button" 
              data-bs-toggle="collapse" 
              data-bs-target="#mobileFilterMenu" 
              aria-expanded="false" 
              aria-controls="mobileFilterMenu"
              style={{ borderRadius: 0, fontWeight: 'bold' }}
            >
              <span>FILTER INVENTORY</span>
              <i className="bi bi-chevron-down"></i> {/* Replace with an SVG or icon if needed */}
            </button>

            {/* COLLAPSIBLE WRAPPER */}
            {/* 'collapse' hides it on mobile, 'd-md-block' forces it to show on desktop */}
            <div className="collapse d-md-block" id="mobileFilterMenu">
              <div className="filter-section">
                <h4 className="mb-4 d-none d-md-flex justify-content-between align-items-center">
                  <span style={{ color: "white" }}>Filter Inventory</span>
                  <span className="badge bg-warning text-dark fs-6">{filteredItems.length}</span>
                </h4>

                <form>
                  {/* Transmission */}
                  <div className="filter-group">
                    <label className="filter-label-main">Transmission</label>
                    <div className="form-check form-switch mb-2">
                      <input className="form-check-input" type="checkbox" id="auto" />
                      <label className="form-check-label sub-section-text" htmlFor="auto">Automatic</label>
                    </div>
                    <div className="form-check form-switch">
                      <input className="form-check-input" type="checkbox" id="manual" />
                      <label className="form-check-label sub-section-text" htmlFor="manual">Manual</label>
                    </div>
                  </div>

                  {/* Engine Type */}
                  <div className="filter-group">
                    <label className="filter-label-main">Engine Type</label>
                    <div className="form-check mb-2">
                      <input className="form-check-input" type="checkbox" id="electric" />
                      <label className="form-check-label sub-section-text" htmlFor="electric">Electric (EV)</label>
                    </div>
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" id="fuel" />
                      <label className="form-check-label sub-section-text" htmlFor="fuel">Fuel / Hybrid</label>
                    </div>
                  </div>

                  {/* Condition */}
                  <div className="filter-group">
                    <label className="filter-label-main">Vehicle Condition</label>
                    <div className="form-check mb-2">
                      <input className="form-check-input" type="radio" name="condition" id="new" />
                      <label className="form-check-label sub-section-text" htmlFor="new">Brand New</label>
                    </div>
                    <div className="form-check">
                      <input className="form-check-input" type="radio" name="condition" id="used" />
                      <label className="form-check-label sub-section-text" htmlFor="used">Pre-Owned</label>
                    </div>
                  </div>

                  {/* Price Range */}
                  <div className="mb-4">
                    <label className="filter-label-main">Price Range</label>
                    <div className="d-flex gap-2">
                      <input type="number" className="form-control form-control-custom" placeholder="Min" />
                      <input type="number" className="form-control form-control-custom" placeholder="Max" />
                    </div>
                  </div>

                  <button type="submit" className="btn btn-warning w-100 fw-bold border-0 py-2" style={{ borderRadius: 0 }}>
                    Apply Filters
                  </button>
                  <button type="reset" className="btn btn-link btn-sm w-100 text-secondary mt-2 text-decoration-none">
                    Clear All
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div class="col-md-7 col-lg-9">
            <div class="container-fluid p-0">
              <div class="row row-cols-1 row-cols-xl-3 row-cols-md-2 inventory-grid">
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <div class="col">
                      <Card item={item}/>
                    </div>
                  ))
                ) : (
                  <div class="col-12 text-center py-5">
                    <h3 class="text-muted">No high-performance vehicles match your criteria.</h3>
                    <p>Try adjusting your filters or search terms.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
        </div>
      </section>

      <section>
        <Footer/>
      </section>
    </>
  )
}

export default Menu;