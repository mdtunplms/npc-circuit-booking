import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";

import Sidebar from "../components/Sidebar";

import {
  createUser,
  deleteUser,
  getBungalows,
  getUsers,
  updateUser,
} from "../api/userApi";

const emptyForm = {
  full_name: "",
  email: "",
  password: "",
  institution: "",
  mobile_no: "",
  role: "USER",
  assigned_bungalow_id: "",
};

export default function Users() {
  const [users, setUsers] = useState([]);

  const [bungalows, setBungalows] = useState([]);

  const [form, setForm] = useState(emptyForm);

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

  const currentUser = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    loadUsers();
    loadBungalows();
  }, []);

  const loadUsers = async () => {
    const res = await getUsers();

    setUsers(res.data);
  };

  const loadBungalows = async () => {
    const res = await getBungalows();

    setBungalows(res.data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "role" && value !== "ADMIN"
        ? { assigned_bungalow_id: "" }
        : {}),
    }));
  };

  const resetForm = (clearMessage = true) => {
    setForm(emptyForm);
    setEditingId(null);

    if (clearMessage) {
      setMessage("");
    }
  };

  const submit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const payload = {
        ...form,
        assigned_bungalow_id: form.assigned_bungalow_id || null,
      };

      if (editingId) {
        if (!payload.password) {
          delete payload.password;
        }

        await updateUser(editingId, payload);
        setMessage("User updated successfully");
      } else {
        await createUser(payload);
        setMessage("User created successfully");
      }

      resetForm(false);
      loadUsers();
    } catch (err) {
      setMessage(err.response?.data?.message || "User save failed");
    } finally {
      setLoading(false);
    }
  };

  const editUser = (user) => {
    setEditingId(user.id);
    setMessage("");
    setForm({
      full_name: user.full_name || "",
      email: user.email || "",
      password: "",
      institution: user.institution || "",
      mobile_no: user.mobile_no || "",
      role: user.role || "USER",
      assigned_bungalow_id: user.assigned_bungalow_id || "",
    });
  };

  const removeUser = async (id) => {
    if (!window.confirm("Delete user?")) return;

    try {
      await deleteUser(id);

      loadUsers();
      setMessage("User deleted successfully");
    } catch (err) {
      setMessage(err.response?.data?.message || "User delete failed");
    }
  };

  return (
    <>
      <Navbar />

      <div className="app-shell">
        <Sidebar />

        <main className="app-content">
          <div className="app-page-header">
            <div>
              <h2>User Management</h2>
              <p>Create accounts, manage roles, and assign bungalow admins.</p>
            </div>

            <span className="app-chip">{users.length} users</span>
          </div>

          {message && (
            <div className="alert alert-info py-2">
              {message}
            </div>
          )}

          <form
            className="form-panel mb-4"
            onSubmit={submit}
          >
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">Full Name</label>

                <input
                  className="form-control"
                  name="full_name"
                  value={form.full_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Email</label>

                <input
                  className="form-control"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">
                  Password {editingId ? "(leave blank to keep)" : ""}
                </label>

                <input
                  className="form-control"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  required={!editingId}
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Institution</label>

                <input
                  className="form-control"
                  name="institution"
                  value={form.institution}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Mobile No</label>

                <input
                  className="form-control"
                  name="mobile_no"
                  value={form.mobile_no}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Role</label>

                <select
                  className="form-select"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                  <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                </select>
              </div>

              {form.role === "ADMIN" && (
                <div className="col-md-4">
                  <label className="form-label">Assigned Bungalow</label>

                  <select
                    className="form-select"
                    name="assigned_bungalow_id"
                    value={form.assigned_bungalow_id}
                    onChange={handleChange}
                  >
                    <option value="">Select bungalow</option>

                    {bungalows.map((bungalow) => (
                      <option
                        key={bungalow.id}
                        value={bungalow.id}
                      >
                        {bungalow.name} - {bungalow.location}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="col-12 quick-actions">
                <button
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {editingId ? "Update User" : "Create User"}
                </button>

                {editingId && (
                  <button
                    className="btn btn-secondary"
                    type="button"
                    onClick={resetForm}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </form>

          <div className="table-card">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>ID</th>

                  <th>Name</th>

                  <th>Email</th>

                  <th>Role</th>

                  <th>Assigned Bungalow</th>

                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>

                    <td>{user.full_name}</td>

                    <td>{user.email}</td>

                    <td>
                      <span className="badge text-bg-primary">
                        {user.role}
                      </span>
                    </td>

                    <td>
                      {user.assignedBungalow
                        ? `${user.assignedBungalow.name} - ${user.assignedBungalow.location}`
                        : "-"}
                    </td>

                    <td>
                      <div className="booking-action-bar">
                        <button
                          className="btn btn-warning btn-sm"
                          onClick={() => editUser(user)}
                        >
                          Edit
                        </button>

                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => removeUser(user.id)}
                          disabled={user.id === currentUser?.id}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {!users.length && (
              <div className="empty-state">No users found.</div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
