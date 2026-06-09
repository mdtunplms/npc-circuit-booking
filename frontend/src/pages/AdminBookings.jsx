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

      <div className="row">
        <div className="col-md-2">
          <Sidebar />
        </div>

        <div className="col-md-10 p-4">
          <h2>Pending Bookings</h2>

          <table className="table">
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

                  <td>{item.status}</td>

                  <td>
                    <button
                      className="btn btn-success me-2"
                      onClick={() => approve(item.id)}
                    >
                      Approve
                    </button>

                    <button
                      className="btn btn-danger"
                      onClick={() => reject(item.id)}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
