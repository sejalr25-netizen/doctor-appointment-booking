
import { useEffect, useState } from "react";
import {
  getAppointments,
  updateAppointment,
  getBlockedSlots,
  createBlockedSlot,
  deleteBlockedSlot
} from "../services/api.js";

export default function Admin() {
  const [appointments, setAppointments] = useState([]);
  const [blockedSlots, setBlockedSlots] = useState([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("10:00 AM");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadData() {
    try {
      const [a, b] = await Promise.all([
        getAppointments(),
        getBlockedSlots()
      ]);
      setAppointments(a);
      setBlockedSlots(b);
      setError("");
    } catch {
      setError("Admin data load nahi hua.");
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function changeStatus(appointment, status) {
    try {
      await updateAppointment(appointment.id, { status });
      setMessage(`Appointment marked ${status}.`);
      await loadData();
    } catch {
      setError("Status update nahi hua.");
    }
  }

  async function blockSlot(e) {
    e.preventDefault();

    try {
      await createBlockedSlot({
        id: `BLK-${Date.now()}`,
        date,
        time,
        reason: reason || "Unavailable"
      });

      setMessage("Time slot blocked.");
      setReason("");
      await loadData();
    } catch {
      setError("Slot block nahi hua.");
    }
  }

  async function unblockSlot(id) {
    try {
      await deleteBlockedSlot(id);
      await loadData();
    } catch {
      setError("Slot unblock nahi hua.");
    }
  }

  return (
    <section>
      <h1>Admin Dashboard</h1>
      <p className="muted">Manage demo appointments and slots.</p>

      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>}

      <div className="stats-grid">
        <div className="panel stat-card">
          <span>Total appointments</span>
          <strong>{appointments.length}</strong>
        </div>
        <div className="panel stat-card">
          <span>Confirmed</span>
          <strong>{appointments.filter((a) => a.status === "Confirmed").length}</strong>
        </div>
        <div className="panel stat-card">
          <span>Blocked slots</span>
          <strong>{blockedSlots.length}</strong>
        </div>
      </div>

      <div className="admin-grid">
        <div className="panel">
          <h2>All Appointments</h2>

          {appointments.map((a) => (
            <div className="admin-appointment" key={a.id}>
              <div>
                <strong>{a.patientName}</strong>
                <p>{a.doctorName} · {a.date} · {a.time}</p>
                <span className={`status status-${a.status.toLowerCase()}`}>
                  {a.status}
                </span>
              </div>

              <div className="admin-actions">
                {a.status !== "Completed" && (
                  <button
                    className="button button-small"
                    onClick={() => changeStatus(a, "Completed")}
                  >
                    Complete
                  </button>
                )}

                {a.status !== "Cancelled" && (
                  <button
                    className="button button-small button-danger"
                    onClick={() => changeStatus(a, "Cancelled")}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="panel">
          <h2>Block a Time Slot</h2>

          <form className="stack-form" onSubmit={blockSlot}>
            <label className="field">
              Date
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </label>

            <label className="field">
              Time
              <select value={time} onChange={(e) => setTime(e.target.value)}>
                {[
                  "10:00 AM", "10:30 AM", "11:00 AM",
                  "11:30 AM", "12:00 PM", "12:30 PM",
                  "2:00 PM", "2:30 PM", "3:00 PM",
                  "3:30 PM", "4:00 PM", "4:30 PM"
                ].map((t) => <option key={t}>{t}</option>)}
              </select>
            </label>

            <label className="field">
              Reason
              <input
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Doctor unavailable"
              />
            </label>

            <button className="button">Block Slot</button>
          </form>

          <h3 className="subheading">Blocked Slots</h3>

          {blockedSlots.map((s) => (
            <div className="blocked-item" key={s.id}>
              <span>{s.date} · {s.time}</span>
              <button
                className="text-button danger-text"
                onClick={() => unblockSlot(s.id)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      <p className="small-note">
        Demo only: Admin page has no login security.
      </p>
    </section>
  );
}
