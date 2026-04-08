import { useState } from "react";

function ContactDetails() {
const [contactData, setContactData] = useState({
    email: '',
    phone: '',
    hours: '',
    location: '',
    responseTime: '',
    description: ''
});
  return (
	<>
<div className="card border-0 shadow-sm mb-4 animate__animated animate__fadeIn">
    <div className="card-header bg-white py-3 border-bottom">
        <h6 className="mb-0 fw-bold text-primary text-uppercase small">
            <i className="bi bi-envelope-paper me-2"></i>Contact Page Details
        </h6>
    </div>
    <div className="card-body p-4">
        {/* Row 1: Primary Contact Info */}
        <div className="row g-3 mb-4">
            <div className="col-12 col-md-4 border-end-md">
                <label className="form-label small fw-bold text-muted">Business Email</label>
                <div className="input-group">
                    <span className="input-group-text bg-light border-2"><i className="bi bi-envelope text-primary"></i></span>
                    <input type="email" className="form-control border-2" placeholder="support@business.com" 
                        value={contactData.email} onChange={(e) => setContactData({...contactData, email: e.target.value})} />
                </div>
            </div>
            <div className="col-12 col-md-4 border-end-md">
                <label className="form-label small fw-bold text-muted">Phone Number</label>
                <div className="input-group">
                    <span className="input-group-text bg-light border-2"><i className="bi bi-telephone text-primary"></i></span>
                    <input type="text" className="form-control border-2" placeholder="+1 (555) 000-0000" 
                        value={contactData.phone} onChange={(e) => setContactData({...contactData, phone: e.target.value})} />
                </div>
            </div>
            <div className="col-12 col-md-4">
                <label className="form-label small fw-bold text-muted">Avg. Response Time</label>
                <div className="input-group">
                    <span className="input-group-text bg-light border-2"><i className="bi bi-clock-history text-primary"></i></span>
                    <input type="text" className="form-control border-2" placeholder="e.g. Within 24 hours" 
                        value={contactData.responseTime} onChange={(e) => setContactData({...contactData, responseTime: e.target.value})} />
                </div>
            </div>
        </div>

        {/* Row 2: Location and Hours */}
        <div className="row g-3 mb-4">
            <div className="col-12 col-md-6 border-end-md">
                <label className="form-label small fw-bold text-muted">Physical Location</label>
                <div className="input-group">
                    <span className="input-group-text bg-light border-2"><i className="bi bi-geo-alt text-danger"></i></span>
                    <input type="text" className="form-control border-2" placeholder="123 Business St, City, Country" 
                        value={contactData.location} onChange={(e) => setContactData({...contactData, location: e.target.value})} />
                </div>
            </div>
            <div className="col-12 col-md-6">
                <label className="form-label small fw-bold text-muted">Opening & Closing Hours</label>
                <div className="input-group">
                    <span className="input-group-text bg-light border-2"><i className="bi bi-calendar3 text-primary"></i></span>
                    <input type="text" className="form-control border-2" placeholder="Mon-Fri: 9AM - 5PM, Sat: 10AM - 2PM" 
                        value={contactData.hours} onChange={(e) => setContactData({...contactData, hours: e.target.value})} />
                </div>
            </div>
        </div>

        {/* Row 3: Page Header Description */}
        <div className="row">
            <div className="col-12">
                <label className="form-label small fw-bold text-muted">Contact Page Introduction (Description)</label>
                <textarea 
                    className="form-control border-2 shadow-sm" 
                    rows="4" 
                    placeholder="Write a welcoming message for your contact page visitors..."
                    value={contactData.description}
                    onChange={(e) => setContactData({...contactData, description: e.target.value})}
                ></textarea>
                <div className="form-text small mt-2">
                    This text appears prominently at the top of the Contact Us page.
                </div>
            </div>
        </div>
    </div>
</div>
	</>
  )
}

export default ContactDetails;