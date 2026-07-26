import { useState, useEffect, useRef } from "react"
import api,{base_url} from "../../../api.jsx"
import Dash from "../../../components/dashboard/Dash.jsx"
import Nav from "../../../components/dashboard/Nav.jsx"

function Profile() {
  const [profile, setProfile] = useState([]);

  // To get information about users profile through the backend
  useEffect(() => {
    const GetProfile = async () => {
      try {
        const response = await api.get("/api/accounts/user/get-profile", {
          withCredentials: true
        });

        setProfile(response.data);

      } catch (error) {
        console.error(`Internal server error: ${error}`);
      } finally {

      }
    }

    GetProfile();
  }, []);

    const [profileData, setProfileData] = useState({
      first_name: '',
      last_name: '',
      email: '',
      password: ''
    });

  useEffect(() => {
    if (profile) {
      setProfileData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        email: profile.email || '',
        password: '' // Keep password empty for security
      });
    }
  }, [profile]); // This runs every time 'profile' changes

  // To upload an image into the backend
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileUpload = async (event, username) => {
    const file = event.target.files[0];
    if (!file || !username) return;

    const formData = new FormData();
    formData.append('profileImage', file);
    // Send the username along with the image
    formData.append('username', username);

    setUploading(true);
    try {
      const response = await api.post("/api/accounts/user/upload-profile-pic", formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // We add a timestamp (?t=...) to force the browser to reload the image
      setProfile({ ...profile, profile_img: `${response.data.filename}?t=${Date.now()}` });
      alert("Photo updated successfully!");

    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload photo.");
    } finally {
      setUploading(false);
    }
  };

  // For updating profile
  const [showPassword, setShowPassword] = useState(false);

  const handleUpdateProfile = async () => {
    try {
      const response = await api.put("/api/accounts/user/update-profile", {
        username: profile.username, // Use this to find the user
        ...profileData
      }, {
        withCredentials: true
      });

      alert("Profile updated successfully!");

    } catch (error) {
      console.error("Error updating profile:", error);
      alert(error.response?.data?.message || "Update failed");
    }
  };

  // For deleting the profile from the database
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDeleteProfile = async () => {
    try {
      await api.delete(`/api/accounts/user/delete-self/${profile.id}`, {
        withCredentials: true
      });

      // Redirect to login or home after deletion
      window.location.href = '/';

    } catch (error) {
      console.error("Deletion failed:", error);
      alert("Failed to delete profile.");
    }
  };

  return (
    <>
      <Dash />

      <div className="container-fluid">
      <div className="row">

        <Nav/>

        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 bg-light min-vh-100">
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-4 border-bottom">
            <h1 className="h2">My Profile</h1>
            <button type="button" className="btn btn-primary mx-3" onClick={handleUpdateProfile}>Update</button>
          </div>

          <div className="row">
            {/* Left Column */}
            <div className="col-12 col-xl-4 mb-4">
              <div className="card border-0 shadow-sm text-center p-4">
                <div className="mb-3">
                  <img 
                    src={`${base_url}public/uploads/profiles/${profile.profile_img}`} 
                    className="rounded-circle img-thumbnail shadow-sm" 
                    alt="Profile" 
                    style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                  />
                </div>
                <h5 className="mb-0">{profile.username}</h5>
                <p className="text-muted small">{profile.admin ? "Admin" : "Editor"}</p>
                
                <div className="d-grid gap-2 mt-3">
                  {/* Hidden File Input */}
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={(e) => handleFileUpload(e, profile.username)}
                    style={{ display: 'none' }} 
                    accept="image/*"
                  />
                  <button 
                    className="btn btn-outline-secondary btn-sm" 
                    onClick={() => fileInputRef.current.click()}
                    disabled={uploading}
                  >
                    {uploading ? 'Uploading...' : 'Change Photo'}
                  </button>
                </div>
                {/* ... info section ... */}
              </div>
            </div>

            {/* Right Column */}
            <div className="col-12 col-xl-8">
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-header bg-white py-3">
                  <h6 className="mb-0 fw-bold text-uppercase small">Personal Information</h6>
                </div>
                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">First Name</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={profileData.first_name} 
                        onChange={(e) => setProfileData({...profileData, first_name: e.target.value})} 
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Last Name</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={profileData.last_name} 
                        onChange={(e) => setProfileData({...profileData, last_name: e.target.value})} 
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Settings */}
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-header bg-white py-3">
                  <h6 className="mb-0 fw-bold text-uppercase small">Account Settings</h6>
                </div>
                <div className="card-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Email Address</label>
                      <input 
                        type="email" 
                        className="form-control" 
                        value={profileData.email} 
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})} 
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Username</label>
                      <input type="text" className="form-control" defaultValue={profile.username} disabled />
                    </div>
                  </div>
                </div>
              </div>

              {/* New Password Section */}
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-header bg-white py-3">
                  <h6 className="mb-0 fw-bold text-uppercase small">Security</h6>
                </div>
                <div className="card-body">
                  <label className="form-label small fw-bold">Update Password</label>
                  <div className="input-group">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      className="form-control border-danger" // Red outline
                      placeholder="Enter new password"
                      value={profileData.password}
                      onChange={(e) => setProfileData({...profileData, password: e.target.value})}
                      style={{ border: '2px solid #dc3545' }} // Extra emphasis on the red
                    />
                    <button 
                      className="btn btn-outline-secondary" 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {/* Bootstrap Icons or simple text if you don't have the icon library */}
                      {showPassword ? '👁️' : '🙈'} 
                    </button>
                  </div>
                  <div className="form-text text-danger small">
                    Warning: Changing this will update your login credentials.
                  </div>
                </div>
              </div>

              {/* Delete Profile Section */}
              <div className="card border-danger shadow-sm mb-4" style={{ backgroundColor: '#fff5f5' }}>
                <div className="card-header bg-danger text-white py-3">
                  <h6 className="mb-0 fw-bold text-uppercase small">Danger Zone</h6>
                </div>
                <div className="card-body">
                  <label className="form-label small fw-bold text-danger">Delete Profile</label>
                  <p className="text-muted small mb-3">
                    Deleting your profile is permanent. All your data in the database will be erased and cannot be recovered.
                  </p>

                  {/* Using a simple state check for a two-step confirmation */}
                  {!confirmDelete ? (
                    <button 
                      className="btn btn-danger w-100 fw-bold"
                      onClick={() => setConfirmDelete(true)}
                    >
                      Delete My Profile
                    </button>
                  ) : (
                    <div className="text-center animate__animated animate__fadeIn">
                      <p className="fw-bold text-danger small mb-2">Are you absolutely sure?</p>
                      <div className="d-flex gap-2">
                        <button 
                          className="btn btn-secondary flex-grow-1"
                          onClick={() => setConfirmDelete(false)}
                        >
                          Cancel
                        </button>
                        <button 
                          className="btn btn-outline-danger flex-grow-1 fw-bold"
                          onClick={handleDeleteProfile}
                        >
                          Yes, Delete it
                        </button>
                      </div>
                    </div>
                  )}
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