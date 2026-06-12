import { Link } from "react-router-dom";

export default function Sidebar() {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  return (
    <div
      className="bg-light p-3"
      style={{
        minHeight: "100vh",
      }}
    >
      <h5>Menu</h5>

      <ul className="list-group">
        <Link to="/dashboard" className="list-group-item">
          Dashboard
        </Link>

        <Link to="/rooms" className="list-group-item">
          Rooms
        </Link>

        <Link to="/calendar" className="list-group-item">
          Calendar
        </Link>

        <Link to="/my-bookings" className="list-group-item">
          My Bookings
        </Link>

        <Link to="/create-booking" className="list-group-item">
          Create Booking
        </Link>

        {(user?.role === "ADMIN" || user?.role === "SUPER_ADMIN") && (
          <Link to="/admin-bookings" className="list-group-item">
            Manage Bookings
          </Link>
        )}

        {user?.role === "SUPER_ADMIN" && (
          <Link to="/users" className="list-group-item">
            User Management
          </Link>
        )}
      </ul>
    </div>
  );
}
