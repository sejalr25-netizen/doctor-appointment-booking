
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getAppointments,
  updateAppointment,
  getBlockedSlots
} from "../services/api.js";

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState("");

  async function loadData() {
    try {
      setAppointments(await getAppointments());
      setError("");
    } catch {
      setError("Appointments load nahi hue.");
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function cancelAppointment(appointment) {
    if (!window.confirm("Cancel this appointment?")) return;

    try {
      await updateAppointment(appointment.id, {
        status: "Cancelled"
      });
      await loadData();
    } catch {
      setError("Appointment cancel nahi hui.");
    }
  }

  async function rescheduleAppointment(appointment) {
    const date = window.prompt(
      "New date (YYYY-MM-DD):",
      appointment.date
    );
    if (!date) return;

    const time = window.prompt(
      "New time (example: 10:30 AM):",
      appointment.time
    );
    if (!time) return;

    try {
      const [all, blocked] = await Promise.all([
        getAppointments(),
        getBlockedSlots()
      ]);

      const conflict = all.some(
        (a) =>
          a.id !== appointment.id &&
          String(a.doctorId) === String(appointment.doctorId) &&
          a.date === date &&
          a.time === time &&
          a.status !== "Cancelled"
      );

      const isBlocked = blocked.some(
        (s) => s.date === date && s.time === time
      );

      if (conflict || isBlocked) {
        setError("This time slot is unavailable.");
        return;
      }

      await updateAppointment(appointment.id, {
        date,
        time,
        status: "Confirmed"
      });

      await loadData();
    } catch {
      setError("Reschedule nahi ho paya.");
    }
  }

  const sorted = [...appointments].sort(
    (a, b) => a.date.localeCompare(b.date)
  );

  return (
    <section>
      <div className="section-heading">
        <div>
          <h1>My Appointments</h1>
          <p className="muted">Manage your bookings here.</p>
        </div>
        <Link className="button" to="/">Book a Doctor</Link>
      </div>

      {error && <p className="error">{error}</p>}

      {sorted.length === 0 && (
        <div className="panel">
          <h2>No appointments yet</h2>
          <p>Book a doctor to see your appointment here.</p>
        </div>
      )}

      <div className="appointment-list">
        {sorted.map((a) => (
          <article className="panel appointment-card" key={a.id}>
            <div className="appointment-date">
              <strong>{a.date}</strong>
              <span>{a.time}</span>
            </div>

            <div className="appointment-info">
              <h3>{a.doctorName}</h3>
              <p>{a.specialty} · ₹{a.fee}</p>
              <p className="muted">ID: {a.id}</p>
              <span className={`status status-${a.status.toLowerCase()}`}>
                {a.status}
              </span>
            </div>

            {a.status === "Confirmed" && (
              <div className="appointment-actions">
                <button
                  className="text-button"
                  onClick={() => rescheduleAppointment(a)}
                >
                  Reschedule
                </button>

                <button
                  className="text-button danger-text"
                  onClick={() => cancelAppointment(a)}
                >
                  Cancel
                </button>
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
