import React from "react"
import {Link} from 'react-router-dom'

function Card({item}){
	return(
      <div className="col" key={item._id}>
        <div className="card shadow-sm border-0"> {/* border-0 keeps it clean if you're adding custom lines */}
          {/* 1. The wrapper must be position-relative */}
          <div className="position-relative">
            {item.featured && (
            <span 
              className="badge position-absolute top-0 start-0 m-2" 
              style={{ 
                backgroundColor: "#E62117", 
                zIndex: "1", 
                fontSize: "0.75rem",
                fontWeight: "600",
                textTransform: "uppercase"
              }}
            >
              Special
            </span>
            )}

            <img 
              aria-label={item.name} 
              className="bd-placeholder-img card-img-top" 
              height="225" 
              role="img" 
              width="100%" 
              src={`http://localhost:3000/public/images/${item.images[0]}`} 
            />
          </div>

          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              
              {/* Added a left border, padding-left, and set margins to 0 */}
              <div style={{ borderLeft: "3px solid #E62117", paddingLeft: "12px" }}>
                <p className="mb-0 fw-bold" style={{ fontSize: "0.9rem" }}>
                  {item.year} {item.model}
                </p>
                <p className="mb-0 text-muted" style={{ fontSize: "0.85rem" }}>
                  ${item.price.toLocaleString()}
                </p>
              </div>

              <div>
                <Link to={`/inventory/${item._id}`} state={{car: item}} type="button" className="btn btn-danger btn-sm">View Details</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
	);
}

export default Card;