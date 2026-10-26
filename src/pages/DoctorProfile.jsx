
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getDoctorById } from "../services/api.js";

export default function DoctorProfile() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getDoctorById(id)
      .then(setDoctor)
      .catch(() => setError("Doctor nahi mila."));
  }, [id]);

  if (error) return <p className="error">{error}</p>;
  if (!doctor) return <p>Loading profile...</p>;

  return (
    <section className="panel">
      <div className="profile-header">
        <img
          className="profile-photo"
          src={doctor.photo}
          alt={doctor.name}
        />

        <div>
          <span className="specialty">{doctor.specialty}</span>
          <h1>{doctor.name}</h1>
          <p>{doctor.qualifications}</p>
          <p className="rating">★ {doctor.rating}</p>
        </div>
      </div>

      <h2>About the doctor</h2>
      <p>{doctor.bio}</p>

      <div className="detail-list">
        <p>
          <strong>Clinic address</strong>
          <span>{doctor.address}</span>
        </p>

        <p>
          <strong>Consultation fee</strong>
          <span>₹{doctor.fee}</span>
        </p>

        <p>
          <strong>Working days</strong>
          <span>{doctor.workingDays.join(", ")}</span>
        </p>

        <p>
          <strong>Working hours</strong>
          <span>{doctor.workingHours}</span>
        </p>
      </div>

      <Link
        className="button"
        to={`/booking/${doctor.id}`}
      >
        Book Appointment
      </Link>
    </section>
  );
}
