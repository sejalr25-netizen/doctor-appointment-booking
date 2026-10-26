
import { Link } from "react-router-dom";

function DoctorCard({ doctor }) {
  return (
    <div className="doctor-card">
      <div className="doctor-image-container">
        <img
          src={doctor.photo}
          alt={doctor.name}
          className="doctor-image"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.style.display = "none";
            e.currentTarget.parentElement.classList.add(
              "image-fallback"
            );
          }}
        />

        <span className="doctor-emoji" aria-hidden="true">
          🩺
        </span>
      </div>

      <div className="doctor-card-content">
        <div className="doctor-card-top">
          <span className="specialty-badge">
            {doctor.specialty}
          </span>

          <span className="doctor-rating">
            ⭐ {doctor.rating}
          </span>
        </div>

        <h3>{doctor.name}</h3>

        <p className="doctor-qualification">
          {doctor.qualifications}
        </p>

        <p className="doctor-address">
          📍 {doctor.address}
        </p>

        <div className="doctor-card-footer">
          <p className="doctor-fee">
            ₹{doctor.fee}
            <span> / consultation</span>
          </p>

          <Link
            to={`/doctors/${doctor.id}`}
            className="view-profile-btn"
          >
            View Profile
          </Link>
        </div>
      </div>
    </div>
  );
}

export default DoctorCard;
