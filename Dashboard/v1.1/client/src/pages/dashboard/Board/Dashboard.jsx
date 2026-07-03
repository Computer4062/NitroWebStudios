import React, { useEffect, useState } from 'react';
import Dash from "../../../components/dashboard/Dash.jsx";
import Nav from "../../../components/dashboard/Nav.jsx";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

import "./Dashboard.css"

const AnalyticsDashboard = () => {
  const [analyticsData, setAnalyticsData] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [timeframe, setTimeframe] = useState('daily'); // Options: 'daily' | 'monthly' | 'yearly'
  const [chartData, setChartData] = useState([]);

// 1. Fetch the exact JSON dataset payload layout
  useEffect(() => {
    fetch("http://localhost:3000/api/analytics/user/top-products", {
				method: 'GET',
				credentials: 'include'
    }) 
      .then(res => res.json())
      .then(data => {
        setAnalyticsData(data);
        if (data && data.length > 0) {
          setSelectedProduct(data); // Default selection to the first product (e.g., "GEN 2")
        }
      })
      .catch(err => console.error("Error fetching analytics data structure:", err));
  }, []);

  // 2. Format timeline vectors whenever timeframe or active target shifts
  useEffect(() => {
    if (!selectedProduct) return;

    const rawHistory = selectedProduct.hits || [];
    const todayHits = selectedProduct.todaysHits || 0;
    
    // Append today's active live database metrics seamlessly into the historical timeframe matrix
    const todayStr = new Date().toISOString().slice(0, 10);
    
    // Check if today is already archived in the hits block to prevent layout duplication rendering
    const hasTodayInHistory = rawHistory.some(h => h.date === todayStr);
    const fullTimeline = hasTodayInHistory 
      ? [...rawHistory] 
      : [...rawHistory, { date: todayStr, count: todayHits }];

    if (timeframe === 'daily') {
      const dailyPoints = fullTimeline.map(item => ({
        label: item.date, // Outputs "2026-06-24", "2026-06-25", etc.
        views: item.count
      }));
      setChartData(dailyPoints);
      
    } else if (timeframe === 'monthly') {
      const monthlyMap = {};
      fullTimeline.forEach(item => {
        const monthKey = item.date.slice(0, 7); // Groups by "2026-06"
        monthlyMap[monthKey] = (monthlyMap[monthKey] || 0) + item.count;
      });
      
      const monthlyPoints = Object.keys(monthlyMap).sort().map(key => ({
        label: key,
        views: monthlyMap[key]
      }));
      setChartData(monthlyPoints);

    } else if (timeframe === 'yearly') {
      const yearlyMap = {};
      fullTimeline.forEach(item => {
        const yearKey = item.date.slice(0, 4); // Groups by "2026"
        yearlyMap[yearKey] = (yearlyMap[yearKey] || 0) + item.count;
      });

      const yearlyPoints = Object.keys(yearlyMap).sort().map(key => ({
        label: key,
        views: yearlyMap[key]
      }));
      setChartData(yearlyPoints);
    }

  }, [selectedProduct, timeframe]);

  // Helper calculation to aggregate lifetime clicks per item card bubble representation
  const calculateLifetimeHits = (item) => {
    const historicalSum = item.hits?.reduce((acc, currentDay) => acc + (currentDay.count || 0), 0) || 0;
    return historicalSum + (item.todaysHits || 0);
  };

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
            
            {/* --- HEADER CONTROLS --- */}
            <div className="card-header bg-white border-0 p-4 d-flex justify-content-between align-items-center">
              <div>
                <h5 className="mb-1 fw-bold text-dark">Traffic Intelligence Dashboard</h5>
                <p className="text-muted small mb-0">
                  {selectedProduct ? `Analyzing Vehicle: ${selectedProduct.name}` : 'Select a product component from the grid layout'}
                </p>
              </div>
              
              <div className="btn-group shadow-sm rounded-3 overflow-hidden" role="group">
                {['daily', 'monthly', 'yearly'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    className={`btn btn-sm text-capitalize px-3 ${timeframe === type ? 'btn-primary fw-semibold' : 'btn-light text-secondary'}`}
                    onClick={() => setTimeframe(type)}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* --- RECHARTS VIEWPORT --- */}
            <div className="card-body bg-light border-bottom p-4">
              <div style={{ width: '100%', height: 300 }}>
                {chartData.length > 0 ? (
                  <ResponsiveContainer>
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0d6efd" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#0d6efd" stopOpacity={0.0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
                      <XAxis dataKey="label" stroke="#888888" fontSize={11} tickLine={false} />
                      <YAxis stroke="#888888" fontSize={11} tickLine={false} allowDecimals={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                        labelStyle={{ fontWeight: 'bold', color: '#333' }}
                      />
                      <Area type="monotone" dataKey="views" name="Page Views" stroke="#0d6efd" strokeWidth={2} fillOpacity={1} fill="url(#colorViews)" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="d-flex justify-content-center align-items-center h-100 text-muted">
                    No historical trajectory dataset found for this selection frame.
                  </div>
                )}
              </div>
            </div>

          {/* --- SELECTION GRID COMPONENT --- */}
          <div className="card-body p-4 bg-white">
            
            {/* 🚀 NEW: Search Bar & Section Header Row */}
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-stretch align-items-sm-center gap-3 mb-4">
              <h6 className="fw-bold mb-0 text-secondary text-uppercase small tracking-wide">
                Select Vehicle Track
              </h6>
              
              {/* Search Input Box */}
              <div className="position-relative" style={{ maxWidth: '350px', width: '100%' }}>
                <input
                  type="text"
                  className="form-control form-control-sm ps-5 bg-light-subtle border-light-subtle rounded-pill"
                  placeholder="Search Vehicle by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ padding: '0.5rem 1rem 0.5rem 2.5rem' }}
                />
                {/* Dynamic Search / Clear Icon */}
                <div className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted">
                  {searchQuery ? (
                    <i className="bi bi-x-circle-fill cursor-pointer" onClick={() => setSearchQuery('')}></i>
                  ) : (
                    <i className="bi bi-search small"></i>
                  )}
                </div>
              </div>
            </div>
            
              {/* --- SELECTION GRID WITH SEARCH FILTER APPLIED --- */}
              <div className="row row-cols-2 row-cols-md-4 row-cols-lg-5 g-3">
                {analyticsData
                  .filter((item) => 
                    item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((item) => {
                    const isSelected = selectedProduct && selectedProduct._id === item._id;
                    const itemImageSrc = item.image ? item.image : null;

                    return (
                      <div className="col" key={item._id}>
                        <div 
                          onClick={() => setSelectedProduct(item)}
                          className={`card h-100 rounded-3 border transition-all ${
                            isSelected 
                              ? 'border-primary shadow-sm bg-light-primary text-primary' 
                              : 'border-light-subtle hover-shadow bg-white text-dark'
                          }`}
                          style={{ cursor: 'pointer', transition: 'all 0.2s ease-in-out' }}
                        >
                          {/* Image Frame Viewport Container */}
                          <div className="bg-light d-flex align-items-center justify-content-center overflow-hidden rounded-top-3" style={{ height: '120px' }}>
                            {itemImageSrc ? (
                              <img 
                                src={`http://localhost:3000/public${itemImageSrc}`} 
                                alt={item.name} 
                                className="w-100 h-100 object-fit-cover"
                              />
                            ) : (
                              <span className="text-muted text-center p-2 small">No Preview</span>
                            )}
                          </div>

                          {/* Core Card Info Tally Metadata */}
                          <div className="card-body p-3 d-flex flex-column justify-content-between">
                            <p className="card-title fw-bold text-truncate mb-1 small" title={item.name}>
                              {item.name}
                            </p>
                            <div className="d-flex justify-content-between align-items-center mt-2 pt-2 border-top">
                              <span className="text-muted font-monospace" style={{ fontSize: '10px' }}>Lifetime:</span>
                              <span className="badge rounded-pill bg-secondary px-2 py-1 font-monospace">
                                {calculateLifetimeHits(item)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* 🚀 NEW: Fallback UI State if no match is found */}
              {analyticsData.filter((item) => item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                <div className="text-center py-5">
                  <i className="bi bi-patch-question text-muted h3"></i>
                  <p className="text-muted mb-0 mt-2">No items found matching "{searchQuery}"</p>
                </div>
              )}
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

          </div>

        </main>

        </div>
      </div>
    </>
  );
};

export default AnalyticsDashboard;