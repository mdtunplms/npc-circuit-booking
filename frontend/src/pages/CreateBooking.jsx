import { useState, useEffect } from "react";

import Navbar from "../components/Navbar";

import Sidebar from "../components/Sidebar";

import { createBooking } from "../api/bookingApi";

import { getRooms } from "../api/roomApi";

export default function CreateBooking() {
  const [rooms, setRooms] = useState([]);

  const [form, setForm] = useState({
    bungalowId: 1,

    roomIds: "",

    check_in: "",

    check_out: "",

    purpose: "",

    guests_count: 1,
  });

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    const res = await getRooms();

    setRooms(res.data);
  };

  const submit = async (e) => {
    e.preventDefault();

    await createBooking(form);

    alert("Booking Submitted");
  };

  return (
    <>
      <Navbar />

      <div className="app-shell">
        <Sidebar />

        <main className="app-content">
          <div className="app-page-header">
            <div>
              <h2>Create Booking</h2>
              <p>Select a room, dates, and purpose to submit your request.</p>
            </div>
          </div>

          <form className="form-panel" onSubmit={submit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Room</label>

                <select
                  className="form-select"
                  required
                  value={form.roomIds}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      roomIds: e.target.value,
                    })
                  }
                >
                  <option value="">Select Room</option>

                  {rooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.room_number || room.room_no} - {room.room_type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-3">
                <label className="form-label">Check In</label>

                <input
                  type="date"
                  className="form-control"
                  required
                  onChange={(e) =>
                    setForm({
                      ...form,
                      check_in: e.target.value,
                    })
                  }
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">Check Out</label>

                <input
                  type="date"
                  className="form-control"
                  required
                  onChange={(e) =>
                    setForm({
                      ...form,
                      check_out: e.target.value,
                    })
                  }
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Guests</label>

                <input
                  type="number"
                  min="1"
                  className="form-control"
                  value={form.guests_count}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      guests_count: e.target.value,
                    })
                  }
                />
              </div>

              <div className="col-md-8">
                <label className="form-label">Purpose</label>

                <textarea
                  className="form-control"
                  rows="4"
                  required
                  placeholder="Official visit, training program, family stay..."
                  onChange={(e) =>
                    setForm({
                      ...form,
                      purpose: e.target.value,
                    })
                  }
                />
              </div>

              <div className="col-12 quick-actions">
                <button className="btn btn-success" type="submit">
                  Submit Booking
                </button>
              </div>
            </div>
          </form>
        </main>
      </div>
    </>
  );
}
