import React, { useEffect, useState } from 'react';
import Dash from "../../../components/Dashboard/Dash.jsx";
import Nav from "../../../components/Dashboard/Nav.jsx";
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const AnalyticsDashboard = () => {
  const [analyticsData, setAnalyticsData] = useState({ labels: [], datasets: [] });
  const [pageStats, setPageStats] = useState([]);
  const [summary, setSummary] = useState({ activeUsers: 0, screenPageViews: 0, sessions: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data from your backend
    fetch('http://localhost:3000/api/analytics/report', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setAnalyticsData({
          labels: data.dailyLabels || [],
          datasets: [{
            label: 'Daily Visitors',
            data: data.dailyValues || [],
            fill: true,
            backgroundColor: 'rgba(13, 110, 253, 0.1)',
            borderColor: 'rgb(13, 110, 253)',
            borderWidth: 2,
            pointBackgroundColor: 'rgb(13, 110, 253)',
            tension: 0.4,
          }]
        });
        setPageStats(data.pages || []);
        // Set summary totals if your backend provides them, otherwise use totals from pages
        setSummary({
          activeUsers: data.totalActiveUsers || 0,
          screenPageViews: data.totalPageViews || 0,
          sessions: data.totalSessions || 0
        });
        setLoading(false);
      })
      .catch(err => {
        console.error("Analytics Fetch Error:", err);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Dash />

      <div className="container-fluid">
        <div className="row">
          <Nav />

          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 bg-light min-vh-100">
            {/* Header Section: Intact as requested */}
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-4 border-bottom">
              <div>
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb mb-1">
                    <li className="breadcrumb-item small text-muted">Dashboard</li>
                    <li className="breadcrumb-item small active" aria-current="page">Analytics</li>
                  </ol>
                </nav>
                <h1 className="h2">Performance Overview</h1>
              </div>
              <div className="btn-toolbar mb-2 mb-md-0">
                <button type="button" className="btn btn-sm btn-outline-secondary">
                  <i className="bi bi-download me-1"></i> Export Report
                </button>
              </div>
            </div>

            {/* 1. Summary Cards */}
            <div className="row mb-4">
              <div className="col-md-4 mb-3">
                <div className="card shadow-sm border-0 h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                      <h6 className="text-muted small text-uppercase fw-bold mb-0">Total Visitors</h6>
                      <i className="bi bi-people text-primary fs-4"></i>
                    </div>
                    <h2 className="mt-2 mb-0">{(summary.activeUsers || 0).toLocaleString()}</h2>
                    <p className="text-success small mb-0 mt-2">
                      <i className="bi bi-arrow-up"></i> Live data from GA4
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-4 mb-3">
                <div className="card shadow-sm border-0 h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                      <h6 className="text-muted small text-uppercase fw-bold mb-0">Page Views</h6>
                      <i className="bi bi-eye text-info fs-4"></i>
                    </div>
                    <h2 className="mt-2 mb-0">{(summary.screenPageViews || 0).toLocaleString()}</h2>
                    <p className="text-muted small mb-0 mt-2">Last 7 days</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4 mb-3">
                <div className="card shadow-sm border-0 h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                      <h6 className="text-muted small text-uppercase fw-bold mb-0">Active Sessions</h6>
                      <i className="bi bi-clock-history text-warning fs-4"></i>
                    </div>
                    <h2 className="mt-2 mb-0">{(summary.sessions || 0).toLocaleString()}</h2>
                    <p className="text-success small mb-0 mt-2">
                      <i className="bi bi-activity"></i> Real-time tracking
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Line Chart Section */}
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-header bg-white py-3">
                <h5 className="mb-0 fw-bold text-dark">Visitor Traffic</h5>
              </div>
              <div className="card-body">
                <div style={{ height: '350px', position: 'relative' }}>
                  {loading ? (
                    <div className="d-flex flex-column justify-content-center align-items-center h-100">
                      <div className="spinner-border text-primary mb-2" role="status"></div>
                      <span>Fetching GA4 Data...</span>
                    </div>
                  ) : (
                    <Line 
                      data={analyticsData} 
                      options={{ 
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: {
                          y: { beginAtZero: true, grid: { color: '#f0f0f0' } },
                          x: { grid: { display: false } }
                        }
                      }} 
                    />
                  )}
                </div>
              </div>
            </div>

            {/* 3. Top Pages Table Section */}
            <div className="card shadow-sm border-0">
              <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-bold text-dark">Most Visited Pages</h5>
                <span className="badge bg-primary-subtle text-primary border border-primary-subtle">Top 10</span>
              </div>
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="ps-4">Page URL</th>
                      <th>Unique Visitors</th>
                      <th className="text-end pe-4">Quick Link</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageStats.length > 0 ? (
                      pageStats.map((page, index) => (
                        <tr key={index}>
                          <td className="ps-4">
                            <span className="badge bg-light text-dark border me-2">{index + 1}</span>
                            <code className="text-primary">{page.url}</code>
                          </td>
                          <td>
                            <span className="fw-bold">{(page.views || 0).toLocaleString()}</span>
                          </td>
                          <td className="text-end pe-4">
                            <a 
                              href={`https://yourwebsite.com${page.url}`} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="btn btn-sm btn-link text-decoration-none"
                            >
                              Visit <i className="bi bi-box-arrow-up-right ms-1"></i>
                            </a>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-center py-4 text-muted">
                          {loading ? "Loading table data..." : "No data found for the selected period."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer Spacer */}
            <div className="py-4"></div>

          </main>
        </div>
      </div>
    </>
  );
};

export default AnalyticsDashboard;