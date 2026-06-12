import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";

import Sidebar from "../components/Sidebar";

import { getRooms } from "../api/roomApi";

export default function Rooms() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    const res = await getRooms();

    setRooms(res.data);
  };

  return (
    <>
      <Navbar />

      <div className="app-shell">
        <Sidebar />

        <main className="app-content">
          <div className="app-page-header">
            <div>
              <h2>Rooms</h2>
              <p>Browse available circuit bungalow rooms and pricing.</p>
            </div>

            <span className="app-chip">{rooms.length} rooms</span>
          </div>

          <div className="table-card">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>ID</th>

                  <th>Room No</th>

                  <th>Type</th>

                  <th>Price</th>
                </tr>
              </thead>

              <tbody>
                {rooms.map((room) => (
                  <tr key={room.id}>
                    <td>{room.id}</td>

                    <td>{room.room_number || room.room_no}</td>

                    <td>
                      <span className="badge text-bg-success">
                        {room.room_type}
                      </span>
                    </td>

                    <td>Rs. {Number(room.price || 0).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {!rooms.length && (
              <div className="empty-state">No rooms found.</div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
