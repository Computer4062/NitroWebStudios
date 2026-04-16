import React, { useEffect, useState } from 'react';
import Dash from "../../../components/Dashboard/Dash.jsx";
import Nav from "../../../components/Dashboard/Nav.jsx";

import "./Dashboard.css"

const AnalyticsDashboard = () => {
  // Find the number of visitors per month seeing each product
  const [productStats, setProductStats] = useState([]);
  const [isResetting, setIsResetting] = useState(false);  

  const fetchStats = async () => {
      try {
          const res = await fetch('http://localhost:3000/api/analytics/admin/top-products', {
            credentials: 'include'
          });
          const data = await res.json();
          setProductStats(data);
      } catch (err) {
          console.error("Fetch error:", err);
      }
  };

  // To adjust product view counter to 0
  const handleReset = async () => {
      if (window.confirm("Are you sure? This will set all product view counts back to zero.")) {
          setIsResetting(true);
          try {
              await fetch('http://localhost:3000/api/analytics/admin/reset-product-hits', { 
                method: 'POST',
                credentials: 'include'
              });
              // Refresh the local data after reset
              await fetchStats(); 
          } catch (err) {
              alert("Reset failed");
          } finally {
              setIsResetting(false);
          }
      }
  };

  useEffect(() => {
      fetchStats();
  }, []);

  // For the traffic share bar
  const totalHits = productStats.reduce((sum, item) => sum + item.hits, 0);

 return (
    <>
      <Dash />
      <div className="container-fluid">
        <div className="row">
          <Nav />

          <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4 bg-light min-vh-100">
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-4 border-bottom">
            <div>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-1">
              <li className="breadcrumb-item small text-muted">Dashboard</li>
              <li className="breadcrumb-item small active" aria-current="page">Analytics</li>
              </ol>
            </nav>
            <h1 className="h3 fw-bold text-dark">Analytics</h1>
            </div>
          </div>

          <div className="card shadow-sm border-0 mt-4 rounded-4 overflow-hidden">
              <div className="card-body p-4 border-bottom bg-light">
                  <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                      <div>
                          <h5 className="fw-bold mb-1">Product Traffic Analytics</h5>
                          <p className="text-muted small mb-0">
                              Tracking visits to product pages. Use the reset button to start a new weekly or monthly tracking cycle.
                          </p>
                      </div>
                      <button 
                          onClick={handleReset} 
                          disabled={isResetting}
                          className="btn btn-outline-danger btn-sm d-flex align-items-center gap-2 px-3"
                      >
                          {isResetting ? (
                              <span className="spinner-border spinner-border-sm"></span>
                          ) : (
                              <i className="bi bi-arrow-counterclockwise"></i>
                          )}
                          {isResetting ? 'Resetting...' : 'Reset All Counts'}
                      </button>
                  </div>
              </div>

              <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                      {/* ... The <thead> and <tbody> from previous response ... */}
                      <thead className="table-light">
                          <tr>
                              <th className="ps-4">Preview</th>
                              <th>Product Name</th>
                              <th className="text-center">Visits</th>
                              <th className="text-end pe-4">Traffic Share</th>
                          </tr>
                      </thead>
                      <tbody>
                          {productStats.map((item, index) => (
                              <tr key={index}>
                                  <td className="ps-4">
                                      <img src={`http://localhost:3000/public${item.image}`} className="rounded" style={{width: '40px', height: '40px', objectFit: 'cover'}} />
                                  </td>
                                  <td className="fw-medium">{item.name}</td>
                                  <td className="text-center">
                                      <span className="badge rounded-pill bg-primary">{item.hits}</span>
                                  </td>
                                  <td className="text-end pe-4">
                                      <div className="progress" style={{height: '5px', width: '80px', marginLeft: 'auto'}}>
                                          <div className="progress-bar bg-orange" style={{width: `${(item.hits / (totalHits)) * 100}%`}}></div>
                                      </div>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          </div>

          <div className="d-flex flex-column gap-4 mt-4">

          {/* TOP CARD: Animated Orange Graph Section */}
            <div className="col-12">
              <div className="graph-container-vertical shadow-lg">
                <div className="graph-overlay"></div>
                
                <div className="text-center position-relative z-3 px-4">
                  <h2 className="text-white fw-bold mb-2">Google Analytics</h2>
                  <p className="text-white-50 mb-4 mx-auto" style={{ maxWidth: '400px' }}>
                    Deep dive into user demographics, retention rates, and conversion funnels.
                  </p>
                  
                  <a 
                    href="https://analytics.google.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-white btn-lg px-5 py-3 fw-bold rounded-pill shadow-sm bg-white text-dark"
                    style={{ transition: 'transform 0.2s' }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <i className="bi bi-graph-up-arrow me-2"></i>
                    View Detailed Reports
                  </a>
                </div>
              </div>
            </div>
            
            {/* BOTTOM CARD: Live Counter
            <div className="col-12">
              <div className="card shadow-sm border-0 py-5">
                <div className="card-body text-center">
                  <div className="d-inline-flex align-items-center justify-content-center bg-primary bg-opacity-10 p-3 rounded-circle mb-3">
                    <i className="bi bi-broadcast text-primary fs-2"></i>
                  </div>
                  <h6 className="text-muted small text-uppercase fw-bold tracking-wider">
                    Currently Active
                  </h6>
                  <h1 className="display-2 fw-bold text-dark my-2">
                    {liveCount.toLocaleString()}
                  </h1>
                  <div className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2 rounded-pill">
                    <span className="spinner-grow spinner-grow-sm me-2" role="status"></span>
                    Live Traffic
                  </div>
                </div>
              </div>
            </div>
             */}

          </div>

        </main>

        </div>
      </div>
    </>
  );
};

export default AnalyticsDashboard;