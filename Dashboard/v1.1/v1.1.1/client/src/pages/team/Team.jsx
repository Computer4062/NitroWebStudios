import {useState, useEffect} from "react"

import NavBar from "../../components/navbar/NavBar.jsx"
import Footer from "../../components/footer/Footer.jsx"
import "./Team.css"

function OurTeam() {

const TeamCard = ({ member }) => (
  <div className="team-member-card flex-shrink-0" style={{ width: '280px' }}>
    <div className="card border-0 bg-black rounded-0 overflow-hidden">
      <div className="member-image-wrapper">
        <img 
          src={member.img} 
          className="card-img-top rounded-0 grayscale-filter" 
          alt={member.name} 
        />
        <div className="member-overlay"></div>
      </div>
      <div className="card-body text-center py-4 border-top border-warning">
        <h5 className="text-white fw-bold mb-1 tracking-wider text-uppercase">{member.name}</h5>
        <p className="text-warning small mb-0 fw-semibold">{member.role}</p>
      </div>
    </div>
  </div>
);

  return (
    <>
      <section>
        <NavBar/>
      </section>

    <section className="bg-dark py-5">
    {/* Hero Section */}
    <div className="container text-center py-5">
        <h1 className="display-3 fw-bold text-white mb-3">
        OUR <span className="text-warning">TEAM</span>
        </h1>
        <div className="heading-line mx-auto mb-4"></div>
        <p className="lead text-secondary mx-auto" style={{ maxWidth: '800px' }}>
        Meet the experts behind the wheel. From master technicians to dedicated sales 
        consultants, our family is here to help you find yours.
        </p>
    </div>

    <div className="container">
        {/* SECTION: SENIOR MANAGEMENT */}
        <div className="mb-5">
        <h3 className="text-white mb-4 ps-3" style={{ borderLeft: "4px solid #ffc107" }}>
            SENIOR MANAGEMENT
        </h3>
        <div className="custom-scroll-row d-flex flex-nowrap flex-md-wrap gap-4 overflow-auto pb-3">
            {[
            { name: "John Doe", role: "Founder & CEO", img: "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400" },
            { name: "Jane Smith", role: "Operations Director", img: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400" },
            { name: "Michael Chen", role: "Head of Finance", img: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400" }
            ].map((member, index) => (
            <TeamCard key={index} member={member} />
            ))}
        </div>
        </div>

        {/* SECTION: SALES TEAM */}
        <div className="mb-5">
        <h3 className="text-white mb-4 ps-3" style={{ borderLeft: "4px solid #ffc107" }}>
            SALES EXPERTS
        </h3>
        <div className="custom-scroll-row d-flex flex-nowrap flex-md-wrap gap-4 overflow-auto pb-3">
            {[
            { name: "Sarah Connor", role: "Senior Sales", img: "https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=400" },
            { name: "Robert Fox", role: "Inventory Manager", img: "https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg?auto=compress&cs=tinysrgb&w=400" },
            { name: "Emily Blunt", role: "Fleet Sales", img: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400" },
            { name: "David Gandy", role: "Used Car Specialist", img: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400" }
            ].map((member, index) => (
            <TeamCard key={index} member={member} />
            ))}
        </div>
        </div>
    </div>
    </section>

      <section>
        <Footer/>
      </section>
    </>
  )
}

export default OurTeam;