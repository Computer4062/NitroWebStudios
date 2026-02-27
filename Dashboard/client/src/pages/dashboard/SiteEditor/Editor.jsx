import {useState, useEffect} from "react"
import { useNavigate } from "react-router-dom";

import Dash from "../../../components/dashboard/Dash.jsx"
import Nav from "../../../components/dashboard/Nav.jsx"

import HomePageEdits from "./HomePageEdits.jsx";

function Profile() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  const [viewMode, setViewMode] = useState('desktop');

  // Check if user is authorized to access this page
  useEffect(() => {
	const checkUserAuth = async() => {
		try{
			const response = await fetch("http://localhost:3000/api/accounts/check-auth", {
				method: 'GET',
				credentials: 'include'
			});

			if(response.status === 401){
				// If not logged in, kick them to login page
				navigate("/login");
      }

      const data = await response.json();
      setIsAdmin(data.admin);

		} catch(error) {
			navigate("/login");
		}
	}

	checkUserAuth();
  }, [navigate]);

  return (
    <>
      <Dash />

      <div class="container-fluid">
      <div class="row">

        <Nav isAdmin={isAdmin} />

      <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-4 bg-light">
        {/* Header Section */}
        <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-4 border-bottom">
          <h1 class="h2">Site Editor</h1>
          
          {/* Device Toggle Buttons */}
          <div class="btn-group shadow-sm" role="group" aria-label="Device Preview">
            <button 
              type="button" 
              class={`btn btn-outline-primary ${viewMode === 'desktop' ? 'active' : ''}`}
              onClick={() => setViewMode('desktop')}
            >
              <i class="bi bi-display me-2"></i>Desktop
            </button>
            <button 
              type="button" 
              class={`btn btn-outline-primary ${viewMode === 'mobile' ? 'active' : ''}`}
              onClick={() => setViewMode('mobile')}
            >
              <i class="bi bi-phone me-2"></i>Mobile
            </button>
          </div>
        </div>

        {/* Simulator Canvas */}
        <div class="d-flex justify-content-center align-items-start" style={{ minHeight: '80vh' }}>
          <div 
            class="card shadow transition-all" 
            style={{ 
              width: viewMode === 'desktop' ? '100%' : '375px', // Standard Mobile Width
              height: viewMode === 'desktop' ? '75vh' : '667px', // Standard Mobile Height
              transition: 'all 0.4s ease-in-out',
              borderRadius: viewMode === 'mobile' ? '30px' : '8px',
              border: viewMode === 'mobile' ? '12px solid #222' : '1px solid #dee2e6',
              overflow: 'hidden'
            }}
          >
            {/* Browser bar for Desktop, Speaker for Mobile */}
            {viewMode === 'mobile' && (
              <div class="bg-dark d-flex justify-content-center align-items-center" style={{ height: '25px' }}>
                <div class="rounded-pill bg-secondary" style={{ width: '40px', height: '4px' }}></div>
              </div>
            )}

            <div class="ratio h-100 w-100 bg-white">
              <iframe 
                src="/" 
                title="Responsive Preview" 
                class="w-100 h-100"
                style={{ 
                  border: 'none',
                  filter: 'none',           // Disables any grayscale filters
                  WebkitFilter: 'none',     // For Safari/Chrome compatibility
                  imageRendering: 'auto'    // Ensures colors render naturally
                }}
              ></iframe>
            </div>
            
            {/* Home button for Mobile View */}
            {viewMode === 'mobile' && (
              <div class="bg-dark d-flex justify-content-center align-items-center" style={{ height: '40px' }}>
                <div class="rounded-circle border border-secondary" style={{ width: '25px', height: '25px' }}></div>
              </div>
            )}
          </div>
        </div>

        {/* Content Editor Section */}
  <div className="mt-5 border-top pt-4">
  <div className="row justify-content-center">
    <div className="col-12 col-xl-10">
      <div className="d-flex align-items-center mb-4">
        <i className="bi bi-pencil-square fs-4 text-primary me-2"></i>
        <h3 className="h5 mb-0">Page Content Settings</h3>
      </div>

      <HomePageEdits />

      {/* Preview button */}
      <div className="d-flex justify-content-between align-items-center bg-white p-3 rounded shadow-sm border mb-5">
        <div className="text-muted small">
          <i className="bi bi-info-circle me-1"></i> 
          Review your changes in the simulator above before saving.
        </div>

        <button 
          type="button" 
          className="btn btn-primary px-5 fw-bold"
          onClick={() => console.log("Save button clicked - Logic to be added later")}
        > Preview
        </button>

        <button 
          type="button" 
          className="btn btn-danger px-5 fw-bold"
          onClick={() => console.log("Save button clicked - Logic to be added later")}
        >
          <i className="bi bi-check2-circle me-2"></i> Publish
        </button>
        
          </div>
          </div>
        </div>
      </div>

      </main>

      </div>
      </div>
    </>
  )
}

export default Profile;