import {useState, useEffect} from "react"
import { useNavigate } from "react-router-dom";

import Dash from "../../../components/Dashboard/Dash.jsx"
import Nav from "../../../components/Dashboard/Nav.jsx"

function Dashboard() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/menu/all')
      .then((response) => response.json())
      .then((data) => {
        setItems(data);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, []);

  return (
    <>
      <Dash />

      <div class="container-fluid">
      <div class="row">

        <Nav/>

        <main class="col-md-9 ms-md-auto col-lg-10 px-md-4 py-4">
        <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-4 border-bottom">
            <h1 class="h2">Dashboard</h1>
            <div class="btn-toolbar mb-2 mb-md-0">
            <button type="button" class="btn btn-sm btn-outline-secondary dropdown-toggle">
                <i class="bi bi-calendar3 me-1"></i> This week
            </button>
            </div>
        </div>

        {/* Stats Overview Cards */}
        <div class="row g-3 mb-4">
            <div class="col-md-4">
            <div class="card border-0 shadow-sm bg-primary text-white p-3">
                <small class="text-uppercase fw-bold opacity-75">Active Users</small>
                <h2 class="mb-0">1,284</h2>
                <div class="small mt-2"><i class="bi bi-arrow-up"></i> 12.5% since last week</div>
            </div>
            </div>
            <div class="col-md-4">
            <div class="card border-0 shadow-sm p-3">
                <small class="text-uppercase fw-bold text-muted">Avg. Session</small>
                <h2 class="mb-0">04:32</h2>
                <div class="small mt-2 text-success"><i class="bi bi-arrow-up"></i> 2.1% improvement</div>
            </div>
            </div>
            <div class="col-md-4">
            <div class="card border-0 shadow-sm p-3">
                <small class="text-uppercase fw-bold text-muted">Bounce Rate</small>
                <h2 class="mb-0">42.3%</h2>
                <div class="small mt-2 text-danger"><i class="bi bi-arrow-down"></i> 0.4% increase</div>
            </div>
            </div>
        </div>

        <div class="row">
            {/* Mock Line Graph (CSS Visualization) */}
            <div class="col-lg-8 mb-4">
            <div class="card border-0 shadow-sm h-100">
                <div class="card-header bg-white py-3">
                <h6 class="mb-0 fw-bold text-muted">Traffic Overview (Mock Graph)</h6>
                </div>
                <div class="card-body">
                <div class="d-flex align-items-end justify-content-between bg-light rounded p-4" style={{ height: '250px' }}>
                    {/* Simple CSS Bar Graph as a placeholder for a Line Chart */}
                    {[40, 70, 45, 90, 65, 85, 30, 60, 95, 50].map((h, i) => (
                    <div key={i} class="bg-primary opacity-75 rounded-top" style={{ width: '8%', height: `${h}%` }}></div>
                    ))}
                </div>
                <div class="d-flex justify-content-between mt-2 px-2 text-muted small">
                    <span>Mon</span><span>Wed</span><span>Fri</span><span>Sun</span>
                </div>
                </div>
            </div>
            </div>

            {/* Mock Pie Chart (CSS Visualization) */}
            <div class="col-lg-4 mb-4">
            <div class="card border-0 shadow-sm h-100">
                <div class="card-header bg-white py-3">
                <h6 class="mb-0 fw-bold text-muted">Device Breakdown</h6>
                </div>
                <div class="card-body d-flex flex-column align-items-center justify-content-center">
                {/* CSS Conic Gradient Pie Chart */}
                <div style={{
                    width: '150px',
                    height: '150px',
                    borderRadius: '50%',
                    background: 'conic-gradient(#0d6efd 0% 65%, #6c757d 65% 90%, #ffc107 90% 100%)'
                }}></div>
                
                <div class="mt-4 w-100">
                    <div class="d-flex justify-content-between small mb-1">
                    <span><i class="bi bi-circle-fill text-primary me-2"></i>Desktop</span>
                    <span class="fw-bold">65%</span>
                    </div>
                    <div class="d-flex justify-content-between small mb-1">
                    <span><i class="bi bi-circle-fill text-secondary me-2"></i>Mobile</span>
                    <span class="fw-bold">25%</span>
                    </div>
                    <div class="d-flex justify-content-between small">
                    <span><i class="bi bi-circle-fill text-warning me-2"></i>Tablet</span>
                    <span class="fw-bold">10%</span>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </div>

        {/* Mock Data Table */}
        <div class="card border-0 shadow-sm">
            <div class="card-header bg-white py-3">
            <h6 class="mb-0 fw-bold text-muted">Recent Traffic Source</h6>
            </div>
            <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
                <thead class="table-light text-uppercase small">
                <tr>
                    <th class="border-0">Source</th>
                    <th class="border-0 text-center">Visitors</th>
                    <th class="border-0 text-center">Page Views</th>
                    <th class="border-0 text-end">Conversion</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td><i class="bi bi-google me-2"></i> Google Search</td>
                    <td class="text-center">854</td>
                    <td class="text-center">2,104</td>
                    <td class="text-end text-success fw-bold">12.4%</td>
                </tr>
                <tr>
                    <td><i class="bi bi-facebook me-2"></i> Social Media</td>
                    <td class="text-center">432</td>
                    <td class="text-center">941</td>
                    <td class="text-end text-success fw-bold">8.1%</td>
                </tr>
                <tr>
                    <td><i class="bi bi-envelope-at me-2"></i> Email Campaign</td>
                    <td class="text-center">120</td>
                    <td class="text-center">450</td>
                    <td class="text-end text-danger fw-bold">2.4%</td>
                </tr>
                </tbody>
            </table>
            </div>
        </div>
        </main>

      </div>
      </div>
    </>
  )
}

export default Dashboard;