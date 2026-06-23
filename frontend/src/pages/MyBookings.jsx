import { useEffect, useState } from "react";

import StatusBadge from "../components/StatusBadge";

import Navbar from "../components/Navbar";

import Sidebar from "../components/Sidebar";

import { myBookings } from "../api/bookingApi";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const loadBookings = async () => {
      const res = await myBookings();

      setBookings(res.data);
    };

    loadBookings();
  }, []);

  return (
    <>
      <Navbar />

      <div className="app-shell">
        <Sidebar />

        <main className="app-content">
          <div className="app-page-header">
            <div>
              <h2>My Bookings</h2>
              <p>Track submitted room requests and approval status.</p>
            </div>

            <span className="app-chip">{bookings.length} requests</span>
          </div>

          <div className="table-card">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Reference</th>

                  <th>Status</th>

                  <th>Check In</th>

                  <th>Check Out</th>
                </tr>
              </thead>

              <tbody>
                {bookings.map((item) => (
                  <tr key={item.id}>
                    <td>{item.booking_reference}</td>

                    <td>
                      <StatusBadge status={item.status} />
                    </td>

                    <td>{item.check_in}</td>

                    <td>{item.check_out}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {!bookings.length && (
              <div className="empty-state">You have not created bookings yet.</div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
