function HomePageEdits() {
  return (
    <>
		<div className="card border-0 shadow-sm mb-4">
        <div className="card-header bg-white py-3 border-bottom">
          <h6 className="mb-0 fw-bold text-uppercase small text-primary">Carousel Content Management</h6>
        </div>
        <div className="card-body p-4">
          <div className="row g-4">
            {/* Carousel Item 1 */}
            <div className="col-12 col-lg-4 border-end-lg">
              <div className="p-2">
                <label className="form-label fw-bold text-dark small">Carousel 1</label>
                
                <div className="mb-3">
                  <input type="text" className="form-control form-control-sm mb-2" placeholder="Title 1" />
                  <input type="text" className="form-control form-control-sm" placeholder="Button Text 1" />
                </div>

                <textarea 
                  className="form-control border-2" 
                  rows="4" 
                  placeholder="Description 1..."
                ></textarea>
                <div className="form-text mt-1 small">Subtitle: Description 1</div>
              </div>
            </div>

            {/* Carousel Item 2 */}
            <div className="col-12 col-lg-4 border-end-lg">
              <div className="p-2">
                <label className="form-label fw-bold text-dark small">Carousel 2</label>
                
                <div className="mb-3">
                  <input type="text" className="form-control form-control-sm mb-2" placeholder="Title 2" />
                  <input type="text" className="form-control form-control-sm" placeholder="Button Text 2" />
                </div>

                <textarea 
                  className="form-control border-2" 
                  rows="4" 
                  placeholder="Description 2..."
                ></textarea>
                <div className="form-text mt-1 small">Subtitle: Description 2</div>
              </div>
            </div>

            {/* Carousel Item 3 */}
            <div className="col-12 col-lg-4">
              <div className="p-2">
                <label className="form-label fw-bold text-dark small">Carousel 3</label>
                
                <div className="mb-3">
                  <input type="text" className="form-control form-control-sm mb-2" placeholder="Title 3" />
                  <input type="text" className="form-control form-control-sm" placeholder="Button Text 3" />
                </div>

                <textarea 
                  className="form-control border-2" 
                  rows="4" 
                  placeholder="Description 3..."
                ></textarea>
                <div className="form-text mt-1 small">Subtitle: Description 3</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default HomePageEdits;