import { useEffect, useMemo, useState } from "react";

import Navbar from "../components/Navbar";

import Sidebar from "../components/Sidebar";

import {
  createRoom,
  deleteRoom,
  getBungalows,
  getRooms,
  updateRoom,
} from "../api/roomApi";

const emptyForm = {
  room_number: "",
  room_type: "AC",
  bungalowId: "",
  max_guests: 2,
  available_beds: 0,
  price: "",
  status: "AVAILABLE",
};

const roomTypeLabels = {
  AC: "A/C Room",
  NON_AC: "Non A/C Room",
  HALL: "Hall",
};

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [bungalows, setBungalows] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const user = useMemo(
    () => JSON.parse(localStorage.getItem("user") || "null"),
    [],
  );

  const canManageRooms =
    user?.role === "SUPER_ADMIN" || user?.role === "ADMIN";

  const loadData = async () => {
    setLoading(true);

    try {
      const [roomRes, bungalowRes] = await Promise.all([
        getRooms(),
        getBungalows(),
      ]);

      setRooms(roomRes.data);
      setBungalows(bungalowRes.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    Promise.all([
      getRooms(),
      getBungalows(),
    ]).then(([roomRes, bungalowRes]) => {
      if (active) {
        setRooms(roomRes.data);
        setBungalows(bungalowRes.data);
        setLoading(false);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  const updateField = (field, value) => {
    setForm((current) => {
      const next = {
        ...current,
        [field]: value,
      };

      if (field === "room_type" && value === "HALL") {
        next.available_beds = current.available_beds || current.max_guests || 1;
        next.max_guests = current.available_beds || current.max_guests || 1;
      }

      if (field === "room_type" && value !== "HALL") {
        next.available_beds = 0;
      }

      if (field === "available_beds" && current.room_type === "HALL") {
        next.max_guests = value;
      }

      return next;
    });
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const startEdit = (room) => {
    setEditingId(room.id);
    setForm({
      room_number: room.room_number || "",
      room_type: room.room_type || "AC",
      bungalowId: room.BungalowId || "",
      max_guests: room.max_guests || 1,
      available_beds: room.available_beds || 0,
      price: room.price || "",
      status: room.status || "AVAILABLE",
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...form,
      max_guests:
        form.room_type === "HALL"
          ? form.available_beds
          : form.max_guests,
      available_beds:
        form.room_type === "HALL"
          ? form.available_beds
          : 0,
    };

    try {
      if (editingId) {
        await updateRoom(editingId, payload);
      } else {
        await createRoom(payload);
      }

      resetForm();
      await loadData();
    } catch (error) {
      alert(error.response?.data?.message || "Unable to save room");
    } finally {
      setSaving(false);
    }
  };

  const removeRoom = async (room) => {
    const confirmed = window.confirm(
      `Delete ${room.room_number || "this room"}?`,
    );

    if (!confirmed) {
      return;
    }

    await deleteRoom(room.id);
    await loadData();
  };

  return (
    <>
      <Navbar />

      <div className="app-shell">
        <Sidebar />

        <main className="app-content">
          <div className="app-page-header">
            <div>
              <h2>Rooms & Halls</h2>
              <p>Manage circuit bungalow rooms, halls, capacity, and pricing.</p>
            </div>

            <span className="app-chip">{rooms.length} units</span>
          </div>

          {canManageRooms && (
            <form className="form-panel room-management-form" onSubmit={submit}>
              <div className="row g-3">
                <div className="col-md-3">
                  <label className="form-label">Bungalow</label>

                  <select
                    className="form-select"
                    required
                    value={form.bungalowId}
                    onChange={(e) => updateField("bungalowId", e.target.value)}
                  >
                    <option value="">Select Bungalow</option>

                    {bungalows.map((bungalow) => (
                      <option key={bungalow.id} value={bungalow.id}>
                        {bungalow.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-2">
                  <label className="form-label">Type</label>

                  <select
                    className="form-select"
                    required
                    value={form.room_type}
                    onChange={(e) => updateField("room_type", e.target.value)}
                  >
                    <option value="AC">A/C Room</option>
                    <option value="NON_AC">Non A/C Room</option>
                    <option value="HALL">Hall</option>
                  </select>
                </div>

                <div className="col-md-2">
                  <label className="form-label">
                    {form.room_type === "HALL" ? "Hall Name" : "Room No"}
                  </label>

                  <input
                    className="form-control"
                    required
                    value={form.room_number}
                    onChange={(e) => updateField("room_number", e.target.value)}
                  />
                </div>

                {form.room_type === "HALL" ? (
                  <div className="col-md-2">
                    <label className="form-label">Available Beds</label>

                    <input
                      type="number"
                      min="1"
                      className="form-control"
                      required
                      value={form.available_beds}
                      onChange={(e) =>
                        updateField("available_beds", e.target.value)
                      }
                    />
                  </div>
                ) : (
                  <div className="col-md-2">
                    <label className="form-label">Max Guests</label>

                    <input
                      type="number"
                      min="1"
                      className="form-control"
                      required
                      value={form.max_guests}
                      onChange={(e) => updateField("max_guests", e.target.value)}
                    />
                  </div>
                )}

                <div className="col-md-2">
                  <label className="form-label">Price</label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="form-control"
                    required
                    value={form.price}
                    onChange={(e) => updateField("price", e.target.value)}
                  />
                </div>

                <div className="col-md-1">
                  <label className="form-label">Status</label>

                  <select
                    className="form-select"
                    value={form.status}
                    onChange={(e) => updateField("status", e.target.value)}
                  >
                    <option value="AVAILABLE">Available</option>
                    <option value="MAINTENANCE">Maintenance</option>
                  </select>
                </div>

                <div className="col-12 quick-actions">
                  <button className="btn btn-success" type="submit">
                    {saving
                      ? "Saving..."
                      : editingId
                        ? "Update"
                        : "Add"}
                  </button>

                  {editingId && (
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={resetForm}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </form>
          )}

          <div className="table-card room-table-card">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>ID</th>

                  <th>Room / Hall</th>

                  <th>Bungalow</th>

                  <th>Type</th>

                  <th>Capacity</th>

                  <th>Status</th>

                  <th>Price</th>

                  {canManageRooms && <th>Actions</th>}
                </tr>
              </thead>

              <tbody>
                {rooms.map((room) => (
                  <tr key={room.id}>
                    <td>{room.id}</td>

                    <td>{room.room_number || room.room_no}</td>

                    <td>{room.Bungalow?.name || "-"}</td>

                    <td>
                      <span className="badge text-bg-success">
                        {roomTypeLabels[room.room_type] || room.room_type}
                      </span>
                    </td>

                    <td>
                      {room.room_type === "HALL"
                        ? `${room.available_beds || room.max_guests || 0} beds`
                        : `${room.max_guests || 0} guests`}
                    </td>

                    <td>{room.status}</td>

                    <td>Rs. {Number(room.price || 0).toLocaleString()}</td>

                    {canManageRooms && (
                      <td>
                        <div className="booking-action-bar">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            type="button"
                            onClick={() => startEdit(room)}
                          >
                            Edit
                          </button>

                          <button
                            className="btn btn-sm btn-outline-danger"
                            type="button"
                            onClick={() => removeRoom(room)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>

            {!loading && !rooms.length && (
              <div className="empty-state">No rooms or halls found.</div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
