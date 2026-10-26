
import { useEffect, useMemo, useState } from "react";
import { getDoctors } from "../services/api.js";
import DoctorCard from "../components/DoctorCard.jsx";

export default function Home() {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("All specialties");
  const [availability, setAvailability] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getDoctors()
      .then(setDoctors)
      .catch(() =>
        setError("Doctors load nahi hue. Mock server check karo.")
      )
      .finally(() => setLoading(false));
  }, []);

  const specialties = useMemo(
    () => [
      "All specialties",
      ...new Set(doctors.map((doctor) => doctor.specialty))
    ],
    [doctors]
  );

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      `${doctor.name} ${doctor.specialty}`
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesSpecialty =
      specialty === "All specialties" ||
      doctor.specialty === specialty;

    const matchesAvailability =
      availability === "all" ||
      doctor.available === (availability === "available");

    return (
      matchesSearch &&
      matchesSpecialty &&
      matchesAvailability
    );
  });

  return (
    <section>
      <div className="hero">
        <div>
          <span className="eyebrow">
            YOUR HEALTH, OUR PRIORITY
          </span>

          <h1>
            Find the right doctor.
            <br />
            <span>Book with confidence.</span>
          </h1>

          <p>
            Explore doctors and book your appointment
            in a few simple steps.
          </p>
        </div>

        <div className="hero-symbol">✚</div>
      </div>

      <div className="section-heading">
        <div>
          <h2>Find a doctor</h2>
          <p className="muted">
            Choose a specialist for your needs.
          </p>
        </div>

        <span className="count-pill">
          {filteredDoctors.length} doctors
        </span>
      </div>

      <div className="filters">
        <input
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search doctor or specialty..."
        />

        <select
          value={specialty}
          onChange={(e) => setSpecialty(e.target.value)}
        >
          {specialties.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select
          value={availability}
          onChange={(e) => setAvailability(e.target.value)}
        >
          <option value="all">Any availability</option>
          <option value="available">Available</option>
          <option value="unavailable">Unavailable</option>
        </select>
      </div>

      {loading && <p>Loading doctors...</p>}

      {error && <p className="error">{error}</p>}

      {!loading && !error && filteredDoctors.length === 0 && (
        <p>No doctors found.</p>
      )}

      <div className="doctor-grid">
        {filteredDoctors.map((doctor) => (
          <DoctorCard key={doctor.id} doctor={doctor} />
        ))}
      </div>
    </section>
  );
}
