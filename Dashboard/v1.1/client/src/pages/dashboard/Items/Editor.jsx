import {useState, useEffect} from "react"
import { useLocation } from "react-router-dom";

import Dash from "../../../components/dashboard/Dash.jsx"
import Nav from "../../../components/dashboard/Nav.jsx"

function UpdateItem() {
	// Retrieve data about the vehicles from the list of vehicles
	const location=useLocation();
	const [vehicleData, setVehicleData] = useState(location.state.vehicle);

	const [loading, setLoading] = useState(false);

	// Functions for adding images of vehicles
	const [vehicleImages, setVehicleImages] = useState([]); // Separate state for files

	const convertPathToBlob = async (serverPath) => {                                                 // Convert server URL's to Blob URL's
		try {
			// 1. Build the full URL to your backend
			const fullUrl = `https://nitroweb-studios-demo-site.onrender.com/public${serverPath}`;

			// 2. Fetch the image data
			const response = await fetch(fullUrl);
			
			// 3. Convert the response into a Blob object
			const imageBlob = await response.blob();

			// 4. Create a local 'blob:' URL from that binary data
			const blobUrl = URL.createObjectURL(imageBlob);

			return blobUrl;
		} catch (error) {
			console.error("Failed to convert image to blob:", error);
			return null;
		}
	};

	// Run only once
	useEffect(() => {
		const loadImages = async () => {
			let updated_image_list = [];

			for (const path of vehicleData.images) {
				// 1. Get the raw Blob data
				const fullUrl = `https://nitroweb-studios-demo-site.onrender.com/public${path}`;
				const response = await fetch(fullUrl);
				const imageBlob = await response.blob();

				// 2. Extract the filename from the path string
				const fileName = path.split('/').pop(); 

				// 3. Convert Blob to a File object
				// This makes it look EXACTLY like it came from <input type="file">
				const file = new File([imageBlob], fileName, { type: imageBlob.type });

				// 4. Create the preview URL
				const preview = URL.createObjectURL(file);

				updated_image_list.push({
					file: file,     // No longer null!
					preview: preview
				});
			}

			setVehicleImages(updated_image_list);
		};

		if (vehicleData?.images) {
			loadImages();
		}
	}, [vehicleData.images]);

	const handleFileChange = (e) => {
		const files = Array.from(e.target.files);
		// Map files to include a preview URL for the UI
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
			// Swap positions
			[updatedImages[index], updatedImages[newIndex]] = [updatedImages[newIndex], updatedImages[index]];
			setVehicleImages(updatedImages);
		}
	};

	const removeImage = (index) => {
		setVehicleImages(vehicleImages.filter((_, i) => i !== index));
	};

	// Function to add the vehicle when save to draft or add vehicle 
	// button has been pressed
	const handleUpdateVehicle = async (e, isDraft = true) => {
		e.preventDefault();
		setLoading(true);

		// Create the FormData object
		const formData = new FormData();

		// 1. Append all text fields
		Object.keys(vehicleData).forEach(key => {
			formData.append(key, vehicleData[key]);
		});

		formData.set('draft', isDraft ? 'true' : 'false');

		// 2. Handle Images for Update
		vehicleImages.forEach((imgObj) => {
			formData.append('images', imgObj.file);
		});;

		// 3. Send the request to the server
		try {
			const response = await fetch(`https://nitroweb-studios-demo-site.onrender.com/api/stocks/admin/update/${vehicleData._id}`, {
				method: 'PUT',
				// Note: DO NOT set 'Content-Type' header manually when using FormData. 
				// The browser will automatically set it to 'multipart/form-data' with the correct boundary.
				body: formData,
				credentials: 'include'
			});

			if (response.ok) {
				alert(isDraft ? "Draft updated successfully!" : "Vehicle updated and published!");
			} else {
				const result = await response.json();
				alert("Update failed: " + result.message);
			}

		} catch (error) {
			console.error("Upload error:", error);
		} finally {
			setLoading(false);
		}
	};

  return (
    <>
      <Dash />

      <div class="container-fluid">
      <div class="row">

        <Nav />

    	<main class="col-md-9 ms-sm-auto col-lg-10 px-md-4 bg-light min-vh-100">
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
							<label className="form-label">Make</label>
							<input type="text" className="form-control" value={vehicleData.make} 
								onChange={(e) => setVehicleData({...vehicleData, make: e.target.value})} />
						</div>
						<div className="col-md-4">
							<label className="form-label">Model</label>
							<input type="text" className="form-control" value={vehicleData.model} 
								onChange={(e) => setVehicleData({...vehicleData, model: e.target.value})} />
						</div>
						<div className="col-md-4">
							<label className="form-label">Year</label>
							<input type="number" className="form-control" value={vehicleData.year} 
								onChange={(e) => setVehicleData({...vehicleData, model: e.target.value})} />
						</div>
						<div className="col-md-4">
							<label className="form-label">Price (OMR)</label>
							<div className="input-group">
								<span className="input-group-text">OMR</span>
								<input type="number" className="form-control" value={vehicleData.price} 
									onChange={(e) => setVehicleData({...vehicleData, price: e.target.value})} />
							</div>
						</div>
						<div className="col-md-4">
							<label className="form-label">Mileage</label>
							<div className="input-group">
								<span className="input-group-text">km</span>
								<input type="number" className="form-control" value={vehicleData.milleage} 
									onChange={(e) => setVehicleData({...vehicleData, milleage: e.target.value})} />
							</div>
						</div>
						<div className="col-md-4">
							<label className="form-label">Type</label>
							<input type="text" className="form-control" value={vehicleData.type} 
								onChange={(e) => setVehicleData({...vehicleData, type: e.target.value})} />
						</div>
					</div>

					{/* Section 2: Mechanical Details */}
					<div className="row g-3 mb-4">
						<div className="col-12"><h6 className="text-muted border-bottom pb-2">Specifications</h6></div>
						<div className="col-md-6 d-flex align-items-end pb-2">
							<div className="form-check form-switch me-4">
								<input className="form-check-input" type="checkbox" id="electricSwitch" 
									checked={vehicleData._electric} 
									onChange={(e) => setVehicleData({...vehicleData, electric: e.target.checked})} />
								<label className="form-check-label" htmlFor="electricSwitch">Electric Vehicle</label>
							</div>
							<div className="form-check">
								<input className="form-check-input" type="checkbox" id="featuredCheck" 
									checked={vehicleData.featured} 
									onChange={(e) => setVehicleData({...vehicleData, featured: e.target.checked})} />
								<label className="form-check-label" htmlFor="featuredCheck">Featured Listing</label>
							</div>
						</div>
					</div>

					{/* Section 3: Media & Description */}
					<div className="row g-3 mb-4">
						<div className="col-12"><h6 className="text-muted border-bottom pb-2">Media & Notes</h6></div>
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

						<div className="col-12">
							<label className="form-label">Description</label>
							<textarea className="form-control" rows="3" value={vehicleData.description}
								onChange={(e) => setVehicleData({...vehicleData, description: e.target.value})}></textarea>
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