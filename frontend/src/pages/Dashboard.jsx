import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

import DashboardCards from "../components/DashboardCards";
import OccupancyChart from "../components/OccupancyChart";
import TodayCheckins from "../components/TodayCheckins";
import TodayCheckouts from "../components/TodayCheckouts";
import StatusBadge from "../components/StatusBadge";

import { roleDashboard, occupancyReport } from "../api/adminApi";
import { myBookings } from "../api/bookingApi";

const activeBookingStatuses = ["APPROVED", "PENDING"];

const formatDate = (dateValue) => {
  if (!dateValue) {
    return "-";
  }

  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(new Date(`${dateValue}T00:00:00`));
};

const formatCurrency = (value) => (
  Number(value || 0).toLocaleString("en", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
);

const roomTypeLabel = (type) => ({
  AC: "A/C Room",
  NON_AC: "Non A/C Room",
  HALL: "Hall",
}[type] || type || "-");

const roomSummary = (rooms = []) => {
  if (!rooms.length) {
    return "-";
  }

  return rooms
    .map((room) => `${room.room_number} (${roomTypeLabel(room.room_type)})`)
    .join(", ");
};

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [dashboard, setDashboard] = useState(null);

  const [report, setReport] = useState(null);

  const [upcomingBookings, setUpcomingBookings] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        // Load dashboard data first
        const dashboardRes = await roleDashboard();

        setDashboard(dashboardRes.data);

        const role = dashboardRes.data.role;

        // Only Admin/Super Admin load occupancy report
        if (role === "ADMIN" || role === "SUPER_ADMIN") {
          const reportRes = await occupancyReport();

          setReport(reportRes.data);
        }

        if (role === "USER") {
          const bookingsRes = await myBookings();
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const upcoming = bookingsRes.data
            .filter((booking) => (
              activeBookingStatuses.includes(booking.status) &&
              new Date(`${booking.check_in}T00:00:00`) >= today
            ))
            .sort((a, b) => (
              new Date(`${a.check_in}T00:00:00`) -
              new Date(`${b.check_in}T00:00:00`)
            ));

          setUpcomingBookings(upcoming);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    initializeDashboard();
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="app-shell">
          <Sidebar />

          <main className="app-content">
            <div className="panel-card">
              <h4>Loading dashboard...</h4>
              <p>Preparing your booking workspace.</p>
            </div>
          </main>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="app-shell">
        <Sidebar />

        <main className="app-content">
          <div className="app-page-header">
            <div>
              <h2>Dashboard</h2>
              <p>Welcome {user?.full_name}. Here is your booking activity overview.</p>
            </div>

            <span className="app-chip">
              Role: {user?.role}
            </span>
          </div>

          {dashboard && (
            <DashboardCards role={dashboard.role} data={dashboard} />
          )}

          {user?.role === "USER" && (
            <div className="table-card mt-4">
              <div className="table-card-header">
                <div>
                  <h5>Upcoming Bookings</h5>
                  <p>Approved and pending room or hall requests.</p>
                </div>

                <span className="app-chip">
                  {upcomingBookings.length} upcoming
                </span>
              </div>

              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Reference</th>
                      <th>Bungalow</th>
                      <th>Room / Hall</th>
                      <th>Dates</th>
                      <th>Guests</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {upcomingBookings.map((booking) => (
                      <tr key={booking.id}>
                        <td>{booking.booking_reference}</td>
                        <td>
                          <strong>{booking.Bungalow?.name || "-"}</strong>
                          <span className="table-muted-line">
                            {booking.Bungalow?.location || ""}
                          </span>
                        </td>
                        <td>{roomSummary(booking.rooms)}</td>
                        <td>
                          {formatDate(booking.check_in)}
                          <span className="table-muted-line">
                            to {formatDate(booking.check_out)}
                          </span>
                        </td>
                        <td>{booking.guests_count}</td>
                        <td>Rs. {formatCurrency(booking.total_amount)}</td>
                        <td>
                          <StatusBadge status={booking.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {!upcomingBookings.length && (
                <div className="empty-state">
                  No upcoming approved or pending bookings.
                </div>
              )}
            </div>
          )}

          {user?.role === "ADMIN" && (
            <div className="row mt-4">
              <div className="col-lg-6 col-md-12 mb-3">
                <TodayCheckins />
              </div>

              <div className="col-lg-6 col-md-12 mb-3">
                <TodayCheckouts />
              </div>
            </div>
          )}

          {(user?.role === "ADMIN" || user?.role === "SUPER_ADMIN") && (
            <div className="row mt-4">
              <div className="col-lg-8 col-md-12">
                <div className="panel-card">
                  <h5>Monthly Occupancy Report</h5>

                  <div
                    style={{
                      height: "300px",
                      width: "100%",
                    }}
                  >
                    <OccupancyChart report={report} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
