import { useState } from "react"
import { useNavigate } from "react-router-dom"

import Dash from "../../../components/dashboard/Dash.jsx"
import Nav from "../../../components/dashboard/Nav.jsx"
import api from "../../../api.jsx"

const FUEL_TYPE_OPTIONS = ["Electric", "Petrol/Diesel"];
const BODY_TYPE_OPTIONS = ["Sedan", "SUV", "Coupe", "Convertible", "Roadster", "Van / MPV"];
const GEARBOX_OPTIONS = ["Automatic", "Manual"];

function AddItems() {
  const navigate = useNavigate();

  // Prepare vehicle data variables — matches the `vehicles` table columns
  const [vehicleData, setVehicleData] = useState({
    name: '',
    brand: '',
    type: 'Sedan',
    fuel_type: 'Petrol/Diesel',
    seats: 5,
    gearbox: 'Automatic',
    price: 0,
    highlighted: false,
    user: '',
  });

  const [loading, setLoading] = useState(false);

  // Functions for adding images of vehicles
  const [vehicleImages, setVehicleImages] = useState([]); // Separate state for files

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setVehicleImages([...vehicleImages, ...newImages].slice(0, 10));
  };

  const moveImage = (index, direction) => {
    const updatedImages = [...vehicleImages];
    const newIndex = direction === 'up' ? index - 1 : index + 1;

    if (newIndex >= 0 && newIndex < updatedImages.length) {
      [updatedImages[index], updatedImages[newIndex]] = [updatedImages[newIndex], updatedImages[index]];
      setVehicleImages(updatedImages);
    }
  };

  const removeImage = (index) => {
    setVehicleImages(vehicleImages.filter((_, i) => i !== index));
  };

  // Function to add the vehicle when save-as-draft or add-vehicle button is pressed
  const handleAddVehicle = async (e, isDraft = true) => {
    e.preventDefault();
    setLoading(true);

    // Fetch the logged-in username and attach it to the vehicle data
    // before submitting, so the backend knows who created this listing
    let username;
    try {
      const authRes = await api.get("/api/accounts/check-username", { withCredentials: true });
      username = authRes.data.name;
    } catch (error) {
      if (error.response?.status === 401) {
        navigate("/dashboard/items");
        setLoading(false);
        return;
      }
      console.error("Auth check failed:", error);
      navigate("/dashboard/items");
      setLoading(false);
      return;
    }

    // Build the final vehicle payload with the username attached
    const finalVehicleData = { ...vehicleData, user: username };

    // Create the FormData object
    const formData = new FormData();

    Object.keys(finalVehicleData).forEach(key => {
      formData.append(key, finalVehicleData[key]);
    });

    formData.set('draft', isDraft ? 'true' : 'false');
    formData.set('highlighted', finalVehicleData.highlighted ? 'true' : 'false');

    // Append all images from the array, in their current order
    vehicleImages.forEach((imgObj) => {
      formData.append('images', imgObj.file);
    });

    // Send the request to the server
    try {
      const response = await api.post("/api/stocks/user/addnew", formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 201 || response.status === 200) {
        alert("Vehicle and images added successfully!");
      } else {
        alert("Something went wrong while adding the vehicle.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      const message = error.response?.data?.message || "Upload failed.";
      alert("Error: " + message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dash />

      <div className="container-fluid">
      <div className="row">

        <Nav />

        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 bg-light min-vh-100">
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-4 border-bottom">
            <div>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-1">
                  <li className="breadcrumb-item small text-muted">Dashboard</li>
                  <li className="breadcrumb-item small active" aria-current="page">Inventory</li>
                  <li className="breadcrumb-item small active" aria-current="page">Editor</li>
                </ol>
              </nav>
              <h1 className="h3 fw-bold text-dark">List new vehicles</h1>
            </div>
          </div>

          <div className="container py-2">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white py-3">
              <h5 className="mb-0">Add New Vehicle to Inventory/Drafts</h5>
            </div>
            <div className="card-body p-4">

            <form>

              {/* Section 1: Basic Information */}
              <div className="row g-3 mb-4">
                <div className="col-12"><h6 className="text-muted border-bottom pb-2">Basic Details</h6></div>
                <div className="col-md-4">
                  <label className="form-label">Name</label>
                  <input type="text" className="form-control" value={vehicleData.name}
                    onChange={(e) => setVehicleData({...vehicleData, name: e.target.value})} />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Brand</label>
                  <input type="text" className="form-control" value={vehicleData.brand}
                    onChange={(e) => setVehicleData({...vehicleData, brand: e.target.value})} />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Type</label>
                  <select className="form-select" value={vehicleData.type}
                    onChange={(e) => setVehicleData({...vehicleData, type: e.target.value})}>
                    {BODY_TYPE_OPTIONS.map(opt => (
                      <option value={opt} key={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Price (OMR / day)</label>
                  <div className="input-group">
                    <span className="input-group-text">OMR</span>
                    <input type="number" className="form-control" value={vehicleData.price}
                      onChange={(e) => setVehicleData({...vehicleData, price: e.target.value})} />
                  </div>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Seats</label>
                  <input type="number" className="form-control" value={vehicleData.seats}
                    onChange={(e) => setVehicleData({...vehicleData, seats: e.target.value})} />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Gearbox</label>
                  <select className="form-select" value={vehicleData.gearbox}
                    onChange={(e) => setVehicleData({...vehicleData, gearbox: e.target.value})}>
                    {GEARBOX_OPTIONS.map(opt => (
                      <option value={opt} key={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Section 2: Mechanical Details */}
              <div className="row g-3 mb-4">
                <div className="col-12"><h6 className="text-muted border-bottom pb-2">Specifications</h6></div>
                <div className="col-md-4">
                  <label className="form-label">Fuel Type</label>
                  <select className="form-select" value={vehicleData.fuel_type}
                    onChange={(e) => setVehicleData({...vehicleData, fuel_type: e.target.value})}>
                    {FUEL_TYPE_OPTIONS.map(opt => (
                      <option value={opt} key={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6 d-flex align-items-end pb-2">
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="highlightedCheck"
                      checked={vehicleData.highlighted}
                      onChange={(e) => setVehicleData({...vehicleData, highlighted: e.target.checked})} />
                    <label className="form-check-label" htmlFor="highlightedCheck">Highlighted Listing</label>
                  </div>
                </div>
              </div>

              {/* Section 3: Media */}
              <div className="row g-3 mb-4">
                <div className="col-12"><h6 className="text-muted border-bottom pb-2">Media</h6></div>

                <div className="col-12">
                  <label className="form-label fw-bold">Vehicle Images</label>

                  <div className="border border-2 border-dashed rounded-3 p-4 text-center bg-light mb-3">
                    <i className="bi bi-images fs-1 text-primary"></i>
                    <p className="mb-2 text-secondary">Click to add images (Drag to reorder functionality below)</p>
                    <input
                      type="file"
                      className="form-control"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </div>

                  <div className="row g-2">
                    {vehicleImages.map((img, index) => (
                      <div key={index} className="col-md-4 col-sm-6">
                        <div className="card h-100 shadow-sm border-0 bg-white">
                          <div className="position-relative">
                            <img
                              src={img.preview}
                              alt="preview"
                              className="card-img-top"
                              style={{ height: '150px', objectFit: 'cover' }}
                            />
                            {index === 0 && (
                              <span className="badge bg-success position-absolute top-0 start-0 m-2">
                                <i className="bi bi-star-fill me-1"></i> Cover Image
                              </span>
                            )}
                            <button
                              type="button"
                              className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2"
                              onClick={() => removeImage(index)}
                            >
                              <i className="bi bi-x"></i>
                            </button>
                          </div>

                          <div className="card-body p-2 d-flex justify-content-between align-items-center">
                            <small className="text-muted">Pos: {index + 1}</small>
                            <div className="btn-group">
                              <button
                                type="button"
                                className="btn btn-outline-secondary btn-sm"
                                disabled={index === 0}
                                onClick={() => moveImage(index, 'up')}
                              >
                                <i className="bi bi-chevron-left"></i>
                              </button>
                              <button
                                type="button"
                                className="btn btn-outline-secondary btn-sm"
                                disabled={index === vehicleImages.length - 1}
                                onClick={() => moveImage(index, 'down')}
                              >
                                <i className="bi bi-chevron-right"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="d-flex justify-content-end gap-2 border-top pt-4">
                <button type="button" className="btn btn-light px-5" disabled={loading} onClick={(e) => handleAddVehicle(e, true)}>Save as Draft</button>
                <button type="submit" className="btn btn-primary px-5 fw-bold" disabled={loading} onClick={(e) => handleAddVehicle(e, false)}>
                  {loading ? (
                    <><span className="spinner-border spinner-border-sm me-2"></span>Uploading...</>
                  ) : "Add to Stock"}
                </button>
              </div>
            </form>

            </div>
          </div>
          </div>
        </main>

      </div>
      </div>
    </>
  )
}

export default AddItems;