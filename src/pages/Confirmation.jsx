

import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { getAppointmentById } from "../services/api.js";

export default function Confirmation() {
  const { id } = useParams();
  const location = useLocation();
  const [appointment, setAppointment] = useState(
    location.state?.appointment || null
  );
  const [error, setError] = useState("");

  useEffect(() => {
    if (!appointment) {
      getAppointmentById(id)
        .then(setAppointment)
        .catch(() => setError("Appointment nahi mila."));
    }
  }, [id, appointment]);

  if (error) return <p className="error">{error}</p>;
  if (!appointment) return <p>Loading confirmation...</p>;

  return (
    <section className="panel confirmation-card">
      <div className="success-icon">✓</div>
      <h1>Appointment Confirmed!</h1>
      <p>Your booking has been saved.</p>

      <div className="appointment-id">
        <span>Appointment ID</span>
        <strong>{appointment.id}</strong>
      </div>

      <div className="detail-list">
        <p><strong>Patient</strong><span>{appointment.patientName}</span></p>
        <p><strong>Doctor</strong><span>{appointment.doctorName}</span></p>
        <p><strong>Specialty</strong><span>{appointment.specialty}</span></p>
        <p><strong>Date</strong><span>{appointment.date}</span></p>
        <p><strong>Time</strong><span>{appointment.time}</span></p>
        <p><strong>Fee</strong><span>₹{appointment.fee}</span></p>
        <p><strong>Status</strong><span>{appointment.status}</span></p>
      </div>

      <div className="button-row no-print">
        <button className="button" onClick={() => window.print()}>
          Print / Save PDF
        </button>
        <Link className="button" to="/appointments">
          My Appointments
        </Link>
      </div>
    </section>
  );
}
