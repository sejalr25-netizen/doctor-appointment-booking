
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getDoctorById,
  getAppointments,
  getBlockedSlots,
  createAppointment
} from "../services/api.js";
import SlotGrid from "../components/SlotGrid.jsx";

const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export default function Booking() {
  const { doctorId } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [blockedSlots, setBlockedSlots] = useState([]);
  const [date, setDate] = useState(today());
  const [time, setTime] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    patientName: "",
    age: "",
    gender: "",
    phone: "",
    email: "",
    reason: ""
  });

  useEffect(() => {
    Promise.all([
      getDoctorById(doctorId),
      getAppointments(),
      getBlockedSlots()
    ])
      .then(([d, a, b]) => {
        setDoctor(d);
        setAppointments(a);
        setBlockedSlots(b);
      })
      .catch(() => setError("Booking data load nahi hua."));
  }, [doctorId]);

  if (!doctor) {
    return <p>{error || "Loading booking form..."}</p>;
  }

  const bookedSlots = appointments
    .filter(
      (a) =>
        String(a.doctorId) === String(doctorId) &&
        a.date === date &&
        a.status !== "Cancelled"
    )
    .map((a) => a.time);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!time) {
      setError("Please select a time slot.");
      return;
    }

    if (
      bookedSlots.includes(time) ||
      blockedSlots.some(
        (s) => s.date === date && s.time === time
      )
    ) {
      setError("This slot is unavailable. Choose another.");
      return;
    }

    setSaving(true);

    try {
      const appointment = await createAppointment({
        ...form,
        id: `APT-${Date.now()}`,
        doctorId: String(doctorId),
        doctorName: doctor.name,
        specialty: doctor.specialty,
        fee: doctor.fee,
        date,
        time,
        status: "Confirmed"
      });

      navigate(`/confirmation/${appointment.id}`, {
        state: { appointment }
      });
    } catch {
      setError("Booking save nahi hui. Mock server check karo.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section>
      <h1>Book your appointment</h1>
      <p className="muted">
        {doctor.name} · Consultation fee ₹{doctor.fee}
      </p>

      <form className="panel form-panel" onSubmit={handleSubmit}>
        <h2>Choose date and time</h2>

        <label className="field">
          Appointment date
          <input
            type="date"
            min={today()}
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              setTime("");
            }}
            required
          />
        </label>

        <SlotGrid
          value={time}
          onChange={setTime}
          bookedSlots={bookedSlots}
          blockedSlots={blockedSlots}
          date={date}
        />

        <h2 className="form-section-title">
          Patient information
        </h2>

        <div className="form-grid">
          <label className="field">
            Patient name
            <input name="patientName" value={form.patientName} onChange={handleChange} required />
          </label>

          <label className="field">
            Age
            <input name="age" type="number" min="1" max="120" value={form.age} onChange={handleChange} required />
          </label>

          <label className="field">
            Gender
            <select name="gender" value={form.gender} onChange={handleChange} required>
              <option value="">Select gender</option>
              <option>Female</option>
              <option>Male</option>
              <option>Other</option>
              <option>Prefer not to say</option>
            </select>
          </label>

          <label className="field">
            Phone
            <input name="phone" type="tel" value={form.phone} onChange={handleChange} required />
          </label>

          <label className="field field-full">
            Email
            <input name="email" type="email" value={form.email} onChange={handleChange} required />
          </label>

          <label className="field field-full">
            Reason for visit
            <textarea name="reason" value={form.reason} onChange={handleChange} rows="3" required />
          </label>
        </div>

        {error && <p className="error">{error}</p>}

        <button className="button" disabled={saving}>
          {saving ? "Booking..." : "Confirm Appointment"}
        </button>
      </form>
    </section>
  );
}
