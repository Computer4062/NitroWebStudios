import { useState } from "react";

function GenericEdits() {
	const [branding, setBranding] = useState({
		name: '',
		logoFile: null,
		logoPreview: null // Stores the blob URL for the immediate preview
	});

	const handleLogoChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setBranding({
				...branding,
				logoFile: file,
				logoPreview: URL.createObjectURL(file) // Creates a temporary URL for the <img> tag
			});
		}
	};

	return (
<div className="card border-0 shadow-sm mb-4">
    <div className="card-header bg-white py-3 border-bottom">
        <h6 className="mb-0 fw-bold text-primary text-uppercase small">
            <i className="bi bi-shop me-2"></i>Business Identity
        </h6>
    </div>
    <div className="card-body p-4">
        <div className="row g-4 align-items-center">
            {/* Left: Name Input */}
            <div className="col-12 col-lg-7 border-end-lg">
                <label className="form-label small fw-bold text-muted">Business Name (NavBar Display)</label>
                <input 
                    type="text" 
                    className="form-control form-control-lg border-2" 
                    placeholder="Enter Business Name"
                    value={branding.name}
                    onChange={(e) => setBranding({...branding, name: e.target.value})}
                />
                <div className="form-text small mt-2">
                    This is the title that users see in the top-left of every page.
                </div>
            </div>

            {/* Right: Logo Upload & Preview */}
            <div className="col-12 col-lg-5">
                <label className="form-label small fw-bold text-muted d-block mb-3">Brand Logo</label>
                <div className="d-flex align-items-center">
                    <div className="me-3">
                        <div className="bg-light border rounded d-flex align-items-center justify-content-center shadow-sm" 
                             style={{ width: '70px', height: '70px', overflow: 'hidden' }}>
                            {branding.logoPreview ? (
                                <img src={branding.logoPreview} style={{ width: '100%', height: '100%', objectFit: 'contain' }} alt="Preview" />
                            ) : (
                                <i className="bi bi-image text-muted fs-3"></i>
                            )}
                        </div>
                    </div>
                    <div className="flex-grow-1">
                        <input 
                            type="file" 
                            className="form-control form-control-sm border-2" 
                            accept="image/*"
                            onChange={handleLogoChange}
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
  	)
}

export default GenericEdits;