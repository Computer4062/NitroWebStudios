import {useState, useEffect} from "react"
import { useNavigate } from "react-router-dom";

import Dash from "../../../components/Dashboard/Dash.jsx"
import Nav from "../../../components/Dashboard/Nav.jsx"

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
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Replace with your actual backend API endpoint
        fetch('http://localhost:3000/api/analytics/report', { credentials: 'include' })
            .then(res => res.json())
            .then(data => {
                // Formatting data for Chart.js
                setAnalyticsData({
                    labels: data.dailyLabels, // e.g., ["Mon", "Tue", "Wed"...]
                    datasets: [{
                        label: 'Total Visitors',
                        data: data.dailyValues, // e.g., [120, 150, 180...]
                        fill: true,
                        backgroundColor: 'rgba(13, 110, 253, 0.1)',
                        borderColor: 'rgb(13, 110, 253)',
                        tension: 0.4,
                    }]
                });
                setPageStats(data.pages); // e.g., [{ url: '/home', views: 400 }]
                setLoading(false);
            })
            .catch(err => console.error("Error loading analytics:", err));
    }, []);

    return (
        <>
        <Dash/>

        <div className="container-fluid">
        <Nav/>

        <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4 bg-light min-vh-100">
        <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-4 border-bottom">
            <h1 class="h2">Dashboard</h1>
            <div class="btn-toolbar mb-2 mb-md-0">
            <button type="button" class="btn btn-sm btn-outline-secondary dropdown-toggle">
                <i class="bi bi-calendar3 me-1"></i> This week
            </button>
            </div>
        </div>

            {/* Summary Cards (Useful Feature) */}
            <div className="row mb-4">
                <div className="col-md-4">
                    <div className="card shadow-sm border-0">
                        <div className="card-body">
                            <h6 className="text-muted small text-uppercase fw-bold">Active Sessions</h6>
                            <h2 className="mb-0">1,284</h2>
                            <span className="text-success small fw-bold"><i className="bi bi-arrow-up"></i> 12% vs last week</span>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card shadow-sm border-0">
                        <div className="card-body">
                            <h6 className="text-muted small text-uppercase fw-bold">Avg. Session Time</h6>
                            <h2 className="mb-0">02:45</h2>
                            <span className="text-danger small fw-bold"><i className="bi bi-arrow-down"></i> 3% vs last week</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Line Graph Section */}
            <div className="card shadow-sm border-0 mb-4">
                <div className="card-header bg-white py-3">
                    <h5 className="mb-0 fw-bold">Visitor Trends (Last 7 Days)</h5>
                </div>
                <div className="card-body">
                    <div style={{ height: '300px' }}>
                        {loading ? (
                            <div className="d-flex justify-content-center align-items-center h-100">Loading Chart...</div>
                        ) : (
                            <Line data={analyticsData} options={{ maintainAspectRatio: false }} />
                        )}
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="card shadow-sm border-0">
                <div className="card-header bg-white py-3">
                    <h5 className="mb-0 fw-bold">Top Performing Pages</h5>
                </div>
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>Page Path</th>
                                <th>Unique Visitors</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pageStats.map((page, index) => (
                                <tr key={index}>
                                    <td className="font-monospace small text-primary">{page.url}</td>
                                    <td><strong>{page.views.toLocaleString()}</strong></td>
                                    <td>
                                        <a href={page.url} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-secondary">
                                            <i className="bi bi-box-arrow-up-right"></i> View Page
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            </main>
        </div>
        </>
    );
};

export default AnalyticsDashboard;