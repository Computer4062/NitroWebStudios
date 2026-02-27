import {useState, useEffect} from "react"
import { useNavigate } from "react-router-dom";

import Dash from "../../../components/Dashboard/Dash.jsx"
import Nav from "../../../components/Dashboard/Nav.jsx"

function Profile() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(true);

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

        <Nav isAdmin={isAdmin} />

      <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-4">
        {/* Header Section */}
        <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-4 border-bottom">
          <h1 class="h2">My Profile</h1>
          <div class="btn-toolbar mb-2 mb-md-0">
            <button type="button" class="btn btn-sm btn-primary shadow-sm">Update Profile</button>
          </div>
        </div>

        <div class="row">
          {/* Left Column: Avatar & Quick Info */}
          <div class="col-12 col-xl-4 mb-4">
            <div class="card border-0 shadow-sm text-center p-4">
              <div class="mb-3">
                <img 
                  src="https://via.placeholder.com/150" 
                  class="rounded-circle img-thumbnail shadow-sm" 
                  alt="Profile" 
                  style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                />
              </div>
              <h5 class="mb-0">Admin Name</h5>
              <p class="text-muted small">System Administrator</p>
              <div class="d-grid gap-2 mt-3">
                <button class="btn btn-outline-secondary btn-sm">Change Photo</button>
              </div>
              <hr />
              <div class="text-start">
                <p class="small mb-1"><strong>Status:</strong> <span class="badge bg-success">Active</span></p>
                <p class="small mb-1"><strong>Member Since:</strong> Jan 2024</p>
                <p class="small mb-0"><strong>Last Login:</strong> 2 hours ago</p>
              </div>
            </div>
          </div>

          {/* Right Column: Detailed Settings */}
          <div class="col-12 col-xl-8">
            {/* Personal Info Card */}
            <div class="card border-0 shadow-sm mb-4">
              <div class="card-header bg-white py-3">
                <h6 class="mb-0 fw-bold text-uppercase small">Personal Information</h6>
              </div>
              <div class="card-body">
                <div class="row g-3">
                  <div class="col-md-6">
                    <label class="form-label small fw-bold">First Name</label>
                    <input type="text" class="form-control" defaultValue="John" />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label small fw-bold">Last Name</label>
                    <input type="text" class="form-control" defaultValue="Doe" />
                  </div>
                  <div class="col-md-12">
                    <label class="form-label small fw-bold">Bio / Short Description</label>
                    <textarea class="form-control" rows="3">Editor at NW Studios. Automotive enthusiast.</textarea>
                    <div class="form-text">This will be displayed on your public author profile.</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Settings Card */}
            <div class="card border-0 shadow-sm mb-4">
              <div class="card-header bg-white py-3">
                <h6 class="mb-0 fw-bold text-uppercase small">Account Settings</h6>
              </div>
              <div class="card-body">
                <div class="row g-3">
                  <div class="col-md-6">
                    <label class="form-label small fw-bold">Email Address</label>
                    <input type="email" class="form-control" defaultValue="admin@nwstudios.com" />
                  </div>
                  <div class="col-md-6">
                    <label class="form-label small fw-bold">Username</label>
                    <input type="text" class="form-control" defaultValue="nw_admin" disabled />
                    <div class="form-text">Usernames cannot be changed.</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Card */}
            <div class="card border-0 shadow-sm border-start border-danger border-4">
              <div class="card-header bg-white py-3">
                <h6 class="mb-0 fw-bold text-uppercase small">Security</h6>
              </div>
              <div class="card-body">
                <div class="d-flex align-items-center justify-content-between mb-3">
                  <div>
                    <p class="mb-0 fw-bold">Two-Factor Authentication</p>
                    <p class="text-muted small mb-0">Add an extra layer of security to your account.</p>
                  </div>
                  <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" role="switch" id="2faSwitch" />
                  </div>
                </div>
                <button class="btn btn-sm btn-outline-danger">Reset Password</button>
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