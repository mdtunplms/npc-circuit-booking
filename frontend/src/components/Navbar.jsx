import { useNavigate } from "react-router-dom";

export default function Navbar() {

  const navigate = useNavigate();

  const logout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");

  };

  return (

    <nav className="navbar navbar-dark bg-dark">

      <div className="container-fluid">

        <span className="navbar-brand">

          NPC Circuit Booking System

        </span>

        <button
          className="btn btn-danger"
          onClick={logout}
        >
          Logout
        </button>

      </div>

    </nav>

  );

}