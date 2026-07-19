import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom";

import Dash from "../../../components/dashboard/Dash.jsx"
import Nav from "../../../components/dashboard/Nav.jsx"
import api from "../../../api.jsx"

const FUEL_TYPE_OPTIONS = ["Electric", "Petrol/Diesel"];
const BODY_TYPE_OPTIONS = ["Sedan", "SUV", "Coupe", "Convertible", "Roadster", "Van / MPV"];
const GEARBOX_OPTIONS = ["Automatic", "Manual"];
const STATUS_OPTIONS = ["Available", "Rented"];

function UpdateItem() {
	const location = useLocation();
	const navigate = useNavigate();

	// Guard: if someone lands here without vehicle state (e.g. direct URL, refresh),
	// bounce back to the inventory list rather than crashing on location.state.vehicle
	const incomingVehicle = location.state?.vehicle;

	const [vehicleData, setVehicleData] = useState(incomingVehicle || null);
	const [loading, setLoading] = useState(false);

	// Functions for handling images of vehicles
	const [vehicleImages, setVehicleImages] = useState([]); // Separate state for files

	useEffect(() => {
		if (!incomingVehicle) {
			navigate("/dashboard/items");
		}
	}, [incomingVehicle, navigate]);

	// Load existing images as File/Blob objects so they behave exactly like
	// files chosen through <input type="file"> — needed so re-submitting the
	// form works whether or not new images were added.
	useEffect(() => {
		const loadImages = async () => {
			if (!vehicleData?.img || vehicleData.img.length === 0) return;

			let updated_image_list = [];

			for (const path of vehicleData.img) {
				try {
					const fullUrl = `http://localhost:3000/public${path}`;
					const response = await api.get(fullUrl, { responseType: 'blob' });
					const imageBlob = response.data;

					const fileName = path.split('/').pop();
					const file = new File([imageBlob], fileName, { type: imageBlob.type });
					const preview = URL.createObjectURL(file);

					updated_image_list.push({ file, preview });
				} catch (error) {
					console.error(`Failed to load image at ${path}:`, error);
				}
			}

			setVehicleImages(updated_image_list);
		};

		loadImages();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [vehicleData?.img]);

	const handleFileChange = (e) => {
		const files = Array.from(e.target.files);
		const newImages = files.map(file => ({
			file,
			preview: URL.createObjectURL(file)
		}));
		setVehicleImages([...vehicleImages, ...newImages]);
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

	// Function to update the vehicle when save-to-draft or update-stock button is pressed
	const handleUpdateVehicle = async (e, isDraft = true) => {
		e.preventDefault();
		setLoading(true);

		// Create the FormData object
		const formData = new FormData();

		// 1. Append the fields that actually exist on the `vehicles` table
		formData.append('name', vehicleData.name);
		formData.append('brand', vehicleData.brand);
		formData.append('type', vehicleData.type);
		formData.append('fuel_type', vehicleData.fuel_type);
		formData.append('status', vehicleData.status);
		formData.append('days_left', vehicleData.days_left ?? '');
		formData.append('seats', vehicleData.seats);
		formData.append('gearbox', vehicleData.gearbox);
		formData.append('price', vehicleData.price);
		formData.append('draft', isDraft ? 'true' : 'false');
		formData.append('highlight', vehicleData.highlight ? 'true' : 'false');

		// 2. Handle Images for Update
		vehicleImages.forEach((imgObj) => {
			formData.append('images', imgObj.file);
		});

		// 3. Send the request to the server
		try {
			const response = await api.put(`/api/stocks/user/update/${vehicleData.id}`, formData, {
				withCredentials: true,
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			});

			if (response.status === 200) {
				alert(isDraft ? "Draft updated successfully!" : "Vehicle updated and published!");
			} else {
				alert("Update failed.");
			}

		} catch (error) {
			console.error("Upload error:", error);
			const message = error.response?.data?.message || "Update failed.";
			alert("Update failed: " + message);
		} finally {
			setLoading(false);
		}
	};

	// Don't render the form until we know we actually have vehicle data
	if (!vehicleData) return null;

  return (
    <>
      <Dash />

      <div className="container-fluid">
      <div className="row">

        <Nav />

    	<main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 bg-light min-vh-100">
			{/* Header Section: Amazon-style Breadcrumbs & Actions */}
			<div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-4 border-bottom">
				<div>
				<nav aria-label="breadcrumb">
					<ol className="breadcrumb mb-1">
					<li className="breadcrumb-item small text-muted">Dashboard</li>
					<li className="breadcrumb-item small active" aria-current="page">Inventory</li>
					<li className="breadcrumb-item small active" aria-current="page">Editor</li>
					</ol>
				</nav>
				<h1 className="h3 fw-bold text-dark">Edit Vehicle Entries</h1>
				</div>
			</div>

			<div className="container py-2">
			<div className="card shadow-sm">
				<div className="card-header bg-primary text-white py-3">
				<h5 className="mb-0">Update Inventory/Drafts</h5>
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

					{/* Section 2: Mechanical & Rental Details */}
					<div className="row g-3 mb-4">
						<div className="col-12"><h6 className="text-muted border-bottom pb-2">Specifications & Status</h6></div>
						<div className="col-md-4">
							<label className="form-label">Fuel Type</label>
							<select className="form-select" value={vehicleData.fuel_type}
								onChange={(e) => setVehicleData({...vehicleData, fuel_type: e.target.value})}>
								{FUEL_TYPE_OPTIONS.map(opt => (
									<option value={opt} key={opt}>{opt}</option>
								))}
							</select>
						</div>
						<div className="col-md-4">
							<label className="form-label">Status</label>
							<select className="form-select" value={vehicleData.status}
								onChange={(e) => setVehicleData({...vehicleData, status: e.target.value})}>
								{STATUS_OPTIONS.map(opt => (
									<option value={opt} key={opt}>{opt}</option>
								))}
							</select>
						</div>
						{vehicleData.status === "Rented" && (
							<div className="col-md-4">
								<label className="form-label">Days Left on Rental</label>
								<input type="number" className="form-control" value={vehicleData.days_left ?? ''}
									onChange={(e) => setVehicleData({...vehicleData, days_left: e.target.value})} />
							</div>
						)}
						<div className="col-md-6 d-flex align-items-end pb-2">
							<div className="form-check">
								<input className="form-check-input" type="checkbox" id="highlightedCheck"
									checked={!!vehicleData.highlight}
									onChange={(e) => setVehicleData({...vehicleData, highlight: e.target.checked})} />
								<label className="form-check-label" htmlFor="highlightedCheck">Highlighted Listing</label>
							</div>
						</div>
					</div>

					{/* Section 3: Media */}
					<div className="row g-3 mb-4">
						<div className="col-12"><h6 className="text-muted border-bottom pb-2">Media</h6></div>
						<div className="col-12">
							<label className="form-label fw-bold">Vehicle Images</label>
							
							{/* Upload Box */}
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

							{/* Image Preview & Ordering Grid */}
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
						<button type="button" className="btn btn-light px-5" disabled={loading} onClick={(e) => handleUpdateVehicle(e, true)}>Save to Drafts</button>
						<button type="submit" className="btn btn-primary px-5 fw-bold" disabled={loading} onClick={(e) => handleUpdateVehicle(e, false)}>
							{loading ? (
								<><span className="spinner-border spinner-border-sm me-2"></span>Uploading...</>
							) : "Update Stock/Drafts"}
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

export default UpdateItem;