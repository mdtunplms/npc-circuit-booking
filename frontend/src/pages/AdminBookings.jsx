import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";

import Sidebar from "../components/Sidebar";

import {
  getPendingBookings,
  approveBooking,
  rejectBooking,
} from "../api/adminApi";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    const res = await getPendingBookings();

    const pending = res.data.filter((item) => item.status === "PENDING");

    setBookings(pending);
  };

  const approve = async (id) => {
    await approveBooking(id);

    loadBookings();
  };

  const reject = async (id) => {
    await rejectBooking(id);

    loadBookings();
  };

  return (
    <>
      <Navbar />

      <div className="app-shell">
        <Sidebar />

        <main className="app-content">
          <div className="app-page-header">
            <div>
              <h2>Pending Bookings</h2>
              <p>Review booking requests and take approval action quickly.</p>
            </div>

            <span className="app-chip">{bookings.length} pending</span>
          </div>

          <div className="table-card">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Reference</th>

                  <th>User</th>

                  <th>Status</th>

                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {bookings.map((item) => (
                  <tr key={item.id}>
                    <td>{item.booking_reference}</td>

                    <td>{item.User?.full_name}</td>

                    <td>
                      <span className="badge text-bg-warning">
                        {item.status}
                      </span>
                    </td>

                    <td>
                      <div className="booking-action-bar">
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => approve(item.id)}
                        >
                          Approve
                        </button>

                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => reject(item.id)}
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {!bookings.length && (
              <div className="empty-state">No pending booking requests.</div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
