
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import DoctorProfile from "./pages/DoctorProfile.jsx";
import Booking from "./pages/Booking.jsx";
import Confirmation from "./pages/Confirmation.jsx";
import MyAppointments from "./pages/MyAppointments.jsx";
import Admin from "./pages/Admin.jsx";
import "./App.css";

export default function App() {
  return (
    <>
      <Navbar />

      <main className="container page">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/doctors/:id"
            element={<DoctorProfile />}
          />
          <Route
            path="/booking/:doctorId"
            element={<Booking />}
          />
          <Route
            path="/confirmation/:id"
            element={<Confirmation />}
          />
          <Route
            path="/appointments"
            element={<MyAppointments />}
          />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>

      <footer className="footer">
        DocBook - Doctor Appointment Booking
      </footer>
    </>
  );
}
