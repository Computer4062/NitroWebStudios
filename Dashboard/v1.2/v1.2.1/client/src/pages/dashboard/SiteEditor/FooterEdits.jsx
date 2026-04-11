import { useState } from "react";

function HomePageEdits() {
  const [footerData, setFooterData] = useState({
      fbLink: '',
      igLink: '',
      xLink: '',
      summary: ''
  });

  return (
    <>
<div className="card border-0 shadow-sm mb-4">
    <div className="card-header bg-white py-3 border-bottom">
        <h6 className="mb-0 fw-bold text-primary text-uppercase small">
            <i className="bi bi-layout-sidebar-inset-reverse me-2"></i>Footer Configuration
        </h6>
    </div>
    <div className="card-body p-4">
        {/* Row 1: Social Links */}
        <div className="row g-3 mb-4">
            <div className="col-12 col-md-4">
                <label className="form-label small fw-bold">Facebook URL</label>
                <div className="input-group">
                    <span className="input-group-text bg-light"><i className="bi bi-facebook text-primary"></i></span>
                    <input type="text" className="form-control" placeholder="Page Link" 
                        value={footerData.fbLink} onChange={(e) => setFooterData({...footerData, fbLink: e.target.value})} />
                </div>
            </div>
            <div className="col-12 col-md-4">
                <label className="form-label small fw-bold">Instagram URL</label>
                <div className="input-group">
                    <span className="input-group-text bg-light"><i className="bi bi-instagram text-danger"></i></span>
                    <input type="text" className="form-control" placeholder="Profile Link" 
                        value={footerData.igLink} onChange={(e) => setFooterData({...footerData, igLink: e.target.value})} />
                </div>
            </div>
            <div className="col-12 col-md-4">
                <label className="form-label small fw-bold">X (Twitter) URL</label>
                <div className="input-group">
                    <span className="input-group-text bg-light"><i className="bi bi-twitter-x"></i></span>
                    <input type="text" className="form-control" placeholder="X Link" 
                        value={footerData.xLink} onChange={(e) => setFooterData({...footerData, xLink: e.target.value})} />
                </div>
            </div>
        </div>

        {/* Row 2: Summary Section */}
        <div className="row">
            <div className="col-12">
                <label className="form-label small fw-bold">Business Summary (0-30 Words)</label>
                <textarea 
                    className="form-control border-2 shadow-sm" 
                    rows="3" 
                    placeholder="Brief description of your business..."
                    value={footerData.summary}
                    onChange={(e) => setFooterData({...footerData, summary: e.target.value})}
                ></textarea>
                <div className="d-flex justify-content-between mt-2">
                    <span className="text-muted small">Appears in the footer section.</span>
                    <span className={`small fw-bold ${footerData.summary.split(' ').filter(x => x).length > 30 ? 'text-danger' : 'text-primary'}`}>
                        Word Count: {footerData.summary.split(' ').filter(x => x).length} / 30
                    </span>
                </div>
            </div>
        </div>
    </div>
</div>
    </>
  )
}

export default HomePageEdits;