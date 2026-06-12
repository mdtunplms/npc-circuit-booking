import { NavLink } from "react-router-dom";

import {
  FaBed,
  FaCalendarAlt,
  FaClipboardCheck,
  FaHome,
  FaPlusCircle,
  FaRegListAlt,
  FaUsersCog,
} from "react-icons/fa";

export default function Sidebar() {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const linkClass = ({ isActive }) =>
    isActive ? "sidebar-link active" : "sidebar-link";

  return (
    <aside className="sidebar">
      <h5 className="sidebar-title">Workspace</h5>

      <nav className="sidebar-list">
        <NavLink to="/dashboard" className={linkClass}>
          <FaHome />
          Dashboard
        </NavLink>

        <NavLink to="/rooms" className={linkClass}>
          <FaBed />
          Rooms
        </NavLink>

        <NavLink to="/calendar" className={linkClass}>
          <FaCalendarAlt />
          Calendar
        </NavLink>

        <NavLink to="/my-bookings" className={linkClass}>
          <FaRegListAlt />
          My Bookings
        </NavLink>

        <NavLink to="/create-booking" className={linkClass}>
          <FaPlusCircle />
          Create Booking
        </NavLink>

        {(user?.role === "ADMIN" || user?.role === "SUPER_ADMIN") && (
          <NavLink to="/admin-bookings" className={linkClass}>
            <FaClipboardCheck />
            Manage Bookings
          </NavLink>
        )}

        {user?.role === "SUPER_ADMIN" && (
          <NavLink to="/users" className={linkClass}>
            <FaUsersCog />
            User Management
          </NavLink>
        )}
      </nav>
    </aside>
  );
}
