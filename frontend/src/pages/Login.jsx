import { useMemo, useRef, useState } from "react";

import { useNavigate } from "react-router-dom";

import {
  FaCalendarAlt,
  FaDoorOpen,
  FaMapMarkerAlt,
  FaRegClock,
  FaUserShield,
  FaUsers,
} from "react-icons/fa";

import api from "../api/axios";

import "./Landing.css";

const stayTypes = {
  official: {
    label: "Official visit",
    nights: "2-4 nights",
    note: "Fast approval flow for department travel.",
  },
  family: {
    label: "Family stay",
    nights: "1-3 nights",
    note: "Room capacity and guest counts stay visible.",
  },
  training: {
    label: "Training program",
    nights: "3-7 nights",
    note: "Plan group stays with bungalow-wise room views.",
  },
};

export default function Login({ initialMode = "login" }) {
  const navigate = useNavigate();

  const authRef = useRef(null);

  const [mode, setMode] = useState(initialMode);

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const [registerForm, setRegisterForm] = useState({
    full_name: "",
    email: "",
    password: "",
    institution: "",
    mobile_no: "",
  });

  const [bookingPreview, setBookingPreview] = useState({
    bungalow: "Kandy Circuit Bungalow",
    stayType: "official",
    guests: 2,
  });

  const [message, setMessage] = useState("");

  const activeStay = stayTypes[bookingPreview.stayType];

  const estimatedRooms = useMemo(() => {
    return Math.max(1, Math.ceil(Number(bookingPreview.guests) / 2));
  }, [bookingPreview.guests]);

  const showAuth = (nextMode) => {
    setMode(nextMode);
    setMessage("");
    authRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  const submitLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await api.post("/auth/login", loginForm);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/dashboard");
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed");
    }
  };

  const submitRegister = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await api.post("/auth/register", registerForm);

      setRegisterForm({
        full_name: "",
        email: "",
        password: "",
        institution: "",
        mobile_no: "",
      });
      setMode("login");
      setMessage("Registration successful. You can login now.");
    } catch (err) {
      setMessage(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <main className="landing-page">
      <section className="landing-hero">
        <div className="landing-overlay">
          <nav className="landing-nav">
            <div>
              <span className="brand-mark">NPC</span>
              <span className="brand-name">Circuit Booking</span>
            </div>

            <div className="nav-actions">
              <button
                className="btn btn-outline-light"
                type="button"
                onClick={() => showAuth("login")}
              >
                Login
              </button>

              <button
                className="btn btn-warning"
                type="button"
                onClick={() => showAuth("register")}
              >
                Register
              </button>
            </div>
          </nav>

          <div className="hero-content">
            <p className="hero-kicker">Room reservations for official stays</p>

            <h1>Book circuit rooms with a clear approval trail.</h1>

            <p className="hero-copy">
              Search available rooms, request a stay, upload supporting
              documents, and track approval status from one place.
            </p>

            <div className="hero-actions">
              <button
                className="btn btn-warning btn-lg"
                type="button"
                onClick={() => showAuth("register")}
              >
                Create account
              </button>

              <button
                className="btn btn-outline-light btn-lg"
                type="button"
                onClick={() => showAuth("login")}
              >
                Staff login
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="booking-insight">
        <div className="insight-copy">
          <span className="section-label">Booking flow</span>
          <h2>Check, request, approve, stay.</h2>
          <p>
            Users can choose a bungalow, select dates, attach a request form,
            and follow the booking status. Admins manage approvals and room
            calendars from their dashboards.
          </p>
        </div>

        <div className="preview-panel">
          <div className="preview-controls">
            <label>
              Bungalow
              <select
                value={bookingPreview.bungalow}
                onChange={(e) =>
                  setBookingPreview({
                    ...bookingPreview,
                    bungalow: e.target.value,
                  })
                }
              >
                <option>Kandy Circuit Bungalow</option>
                <option>Nuwara Eliya Circuit Bungalow</option>
                <option>Anuradhapura Circuit Bungalow</option>
              </select>
            </label>

            <label>
              Stay type
              <select
                value={bookingPreview.stayType}
                onChange={(e) =>
                  setBookingPreview({
                    ...bookingPreview,
                    stayType: e.target.value,
                  })
                }
              >
                {Object.entries(stayTypes).map(([value, item]) => (
                  <option key={value} value={value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Guests
              <input
                min="1"
                max="12"
                type="range"
                value={bookingPreview.guests}
                onChange={(e) =>
                  setBookingPreview({
                    ...bookingPreview,
                    guests: e.target.value,
                  })
                }
              />
            </label>
          </div>

          <div className="booking-summary">
            <div>
              <FaMapMarkerAlt />
              <span>{bookingPreview.bungalow}</span>
            </div>

            <div>
              <FaUsers />
              <span>{bookingPreview.guests} guests</span>
            </div>

            <div>
              <FaDoorOpen />
              <span>{estimatedRooms} room request</span>
            </div>

            <div>
              <FaRegClock />
              <span>{activeStay.nights}</span>
            </div>
          </div>

          <p className="preview-note">{activeStay.note}</p>
        </div>
      </section>

      <section className="feature-strip">
        <article>
          <FaCalendarAlt />
          <h3>Availability calendar</h3>
          <p>See approved bookings and plan room requests by date.</p>
        </article>

        <article>
          <FaDoorOpen />
          <h3>Room-wise booking</h3>
          <p>Select one or more rooms based on capacity and purpose.</p>
        </article>

        <article>
          <FaUserShield />
          <h3>Role-based access</h3>
          <p>Users, admins, and super admins each get the right tools.</p>
        </article>
      </section>

      <section className="auth-section" ref={authRef}>
        <div className="auth-intro">
          <span className="section-label">Account access</span>
          <h2>{mode === "login" ? "Welcome back." : "Create your account."}</h2>
          <p>
            After login, users can create booking requests while admins can
            review, approve, reject, and monitor occupancy.
          </p>
        </div>

        <div className="auth-panel">
          <div className="auth-tabs">
            <button
              className={mode === "login" ? "active" : ""}
              type="button"
              onClick={() => setMode("login")}
            >
              Login
            </button>

            <button
              className={mode === "register" ? "active" : ""}
              type="button"
              onClick={() => setMode("register")}
            >
              Register
            </button>
          </div>

          {message && <div className="auth-message">{message}</div>}

          {mode === "login" ? (
            <form onSubmit={submitLogin}>
              <label>
                Email
                <input
                  required
                  type="email"
                  value={loginForm.email}
                  onChange={(e) =>
                    setLoginForm({
                      ...loginForm,
                      email: e.target.value,
                    })
                  }
                />
              </label>

              <label>
                Password
                <input
                  required
                  type="password"
                  value={loginForm.password}
                  onChange={(e) =>
                    setLoginForm({
                      ...loginForm,
                      password: e.target.value,
                    })
                  }
                />
              </label>

              <button className="btn btn-primary w-100" type="submit">
                Login
              </button>
            </form>
          ) : (
            <form onSubmit={submitRegister}>
              <label>
                Full name
                <input
                  required
                  value={registerForm.full_name}
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
                      full_name: e.target.value,
                    })
                  }
                />
              </label>

              <label>
                Email
                <input
                  required
                  type="email"
                  value={registerForm.email}
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
                      email: e.target.value,
                    })
                  }
                />
              </label>

              <label>
                Password
                <input
                  required
                  type="password"
                  value={registerForm.password}
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
                      password: e.target.value,
                    })
                  }
                />
              </label>

              <label>
                Institution
                <input
                  value={registerForm.institution}
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
                      institution: e.target.value,
                    })
                  }
                />
              </label>

              <label>
                Mobile no
                <input
                  value={registerForm.mobile_no}
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
                      mobile_no: e.target.value,
                    })
                  }
                />
              </label>

              <button className="btn btn-primary w-100" type="submit">
                Register
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
