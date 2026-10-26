
import { NavLink, Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="nav-inner container">
        <Link className="brand" to="/">
          <span className="brand-mark">+</span>
          DocBook
        </Link>

        <nav>
          <NavLink to="/" end>Doctors</NavLink>
          <NavLink to="/appointments">
            My Appointments
          </NavLink>
          <NavLink to="/admin">Admin</NavLink>
        </nav>
      </div>
    </header>
  );
}
