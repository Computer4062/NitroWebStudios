import React from "react"
import {Link} from 'react-router-dom'
import "./Card.css"

function Card({item}){
	return(
      <div class="car-card h-100"  key={item._id}>
          <img  src={`http://localhost:3000/public/images/${item.images[0]}`}  alt="Car Model" />
          <div class="p-4">
            <div class="car-year">{item.year} Model</div>
            <div class="car-model">{item.name}</div>
            
            <hr class="text-secondary opacity-25" />
            
            <div class="d-flex justify-content-between align-items-center mt-3">
              <span class="car-price">$89,990</span>
              <Link to={`/inventory/${item._id}`} type="button" className="btn btn-view-details">View Details</Link>
            </div>
          </div>
        </div>
	);
}

export default Card;