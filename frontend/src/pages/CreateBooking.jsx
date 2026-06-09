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

      <div className="row">
        <div className="col-md-2">
          <Sidebar />
        </div>

        <div className="col-md-10 p-4">
          <h2>Create Booking</h2>

          <form onSubmit={submit}>
            <select
              className="form-control mb-2"
              onChange={(e) =>
                setForm({
                  ...form,
                  roomIds: e.target.value,
                })
              }
            >
              <option>Select Room</option>

              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.room_no}
                </option>
              ))}
            </select>

            <input
              type="date"
              className="form-control mb-2"
              onChange={(e) =>
                setForm({
                  ...form,
                  check_in: e.target.value,
                })
              }
            />

            <input
              type="date"
              className="form-control mb-2"
              onChange={(e) =>
                setForm({
                  ...form,
                  check_out: e.target.value,
                })
              }
            />

            <textarea
              className="form-control mb-2"
              placeholder="Purpose"
              onChange={(e) =>
                setForm({
                  ...form,
                  purpose: e.target.value,
                })
              }
            />

            <button className="btn btn-success">Submit Booking</button>
          </form>
        </div>
      </div>
    </>
  );
}
