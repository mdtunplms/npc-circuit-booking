import { useNavigate } from "react-router-dom";

export default function Navbar() {

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const logout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");

  };

  return (

    <nav className="navbar topbar">

      <div className="container-fluid">

        <span className="navbar-brand">
          <span className="topbar-mark">NPC</span>
          NPC Circuit Booking System

        </span>

        <div className="topbar-user">
          <span className="user-pill">
            {user?.full_name || "Guest"}
            <span className="badge text-bg-success">
              {user?.role || "USER"}
            </span>
          </span>

          <button
            className="btn btn-outline-danger"
            onClick={logout}
          >
            Logout
          </button>
        </div>

      </div>

    </nav>

  );

}
