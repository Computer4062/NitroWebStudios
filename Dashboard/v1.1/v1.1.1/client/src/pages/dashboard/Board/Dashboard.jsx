import React, { useEffect, useState } from 'react';
import Dash from "../../../components/Dashboard/Dash.jsx";
import Nav from "../../../components/Dashboard/Nav.jsx";

import "./Dashboard.css"

const AnalyticsDashboard = () => {
  // GET the live number of users in the site
  const [liveCount, setLiveCount] = useState(0);

  useEffect(() => {
      const fetchLive = () => {
          fetch('http://localhost:3000/api/analytics/admin/live-count',{
            credentials: 'include'
          })
              .then(res => res.json())
              .then(data => setLiveCount(data.activeUsers));
      };

      fetchLive();
      const interval = setInterval(fetchLive, 5000); // Refresh every 5 seconds
      return () => clearInterval(interval);
  }, []);

  // Find the number of visitors per month seeing each product
  const [productStats, setProductStats] = useState([]);

  // Fetch the data on mount
  useEffect(() => {
      fetch('http://localhost:3000/api/analytics/admin/top-products', {
        credentials: 'include'
      })
          .then(res => res.json())
          .then(data => setProductStats(data))
          .catch(err => console.error(err));
  }, []);

  console.log(productStats)

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

        <div className="card shadow-sm border-0 mb-4 rounded-4 overflow-hidden">
          <div className="card-header bg-white py-3 border-bottom">
              <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0 fw-bold">Top Performing Products</h5>
                  <span className="badge bg-primary-subtle text-primary rounded-pill">Monthly Hits</span>
              </div>
          </div>
          <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                      <tr>
                          <th className="ps-4" style={{ width: '80px' }}>Preview</th>
                          <th>Product Details</th>
                          <th className="text-center">Visits (This Month)</th>
                          <th className="text-end pe-4">Trend</th>
                      </tr>
                  </thead>
                  <tbody>
                      {productStats.map((item, index) => (
                          <tr key={index}>
                              <td className="ps-4">
                                  <img 
                                      src={`http://localhost:3000/public${item.image}`} 
                                      alt={item.name} 
                                      className="rounded-3 border"
                                      style={{ width: '48px', height: '48px', objectFit: 'cover' }}
                                  />
                              </td>
                              <td>
                                  <div className="fw-bold text-dark">{item.name}</div>
                                  <small className="text-muted">ID: {item.path.split('/').pop()}</small>
                              </td>
                              <td className="text-center">
                                  <span className="badge bg-dark rounded-pill px-3 py-2">
                                      {item.hits.toLocaleString()}
                                  </span>
                              </td>
                              <td className="text-end pe-4">
                                  {/* Visual representation of popularity */}
                                  <div className="progress" style={{ height: '6px', width: '100px', marginLeft: 'auto' }}>
                                      <div 
                                          className="progress-bar bg-orange" 
                                          style={{ width: `${Math.min((item.hits / productStats.hits) * 100, 100)}%` }}
                                      ></div>
                                  </div>
                              </td>
                          </tr>
                      ))}
                      {productStats.length === 0 && (
                          <tr>
                              <td colSpan="4" className="text-center py-5 text-muted">
                                  No product traffic recorded for this period.
                              </td>
                          </tr>
                      )}
                  </tbody>
              </table>
          </div>
          </div>

          <div className="d-flex flex-column gap-4">

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
            
            {/* BOTTOM CARD: Live Counter */}
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

          </div>

        </main>

        </div>
      </div>
    </>
  );
};

export default AnalyticsDashboard;