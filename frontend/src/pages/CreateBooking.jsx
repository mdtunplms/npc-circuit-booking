import { useMemo, useState, useEffect } from "react";

import Navbar from "../components/Navbar";

import Sidebar from "../components/Sidebar";

import { checkAvailability, createBooking } from "../api/bookingApi";

import { getBungalows, getRooms } from "../api/roomApi";

const roomTypeLabels = {
  AC: "A/C Room",
  NON_AC: "Non A/C Room",
  HALL: "Hall",
};

export default function CreateBooking() {
  const [rooms, setRooms] = useState([]);
  const [bungalows, setBungalows] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [availability, setAvailability] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [checking, setChecking] = useState(false);

  const [form, setForm] = useState({
    bungalowId: "",
    room_type: "",
    check_in: "",
    check_out: "",
    guests_count: 1,
    purpose: "",
    approvalForm: null,
  });

  const roomTypes = useMemo(() => {
    const types = new Set(
      rooms
        .filter((room) => String(room.BungalowId) === String(form.bungalowId))
        .map((room) => room.room_type),
    );

    return ["AC", "NON_AC", "HALL"].filter((type) => types.has(type));
  }, [rooms, form.bungalowId]);

  useEffect(() => {
    let active = true;

    Promise.all([
      getBungalows(),
      getRooms(),
    ]).then(([bungalowRes, roomRes]) => {
      if (active) {
        setBungalows(bungalowRes.data);
        setRooms(roomRes.data);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  const updateForm = (field, value) => {
    const availabilityFields = [
      "bungalowId",
      "room_type",
      "check_in",
      "check_out",
      "guests_count",
    ];

    if (availabilityFields.includes(field)) {
      setAvailability(null);
      setAvailableRooms([]);
    }

    setForm((current) => {
      const next = {
        ...current,
        [field]: value,
        ...(field === "bungalowId" ? { room_type: "" } : {}),
      };

      if (
        field === "check_in" &&
        current.check_out &&
        new Date(current.check_out) <= new Date(value)
      ) {
        next.check_out = "";
      }

      return next;
    });
  };

  const openDatePicker = (event) => {
    try {
      event.currentTarget.showPicker?.();
    } catch {
      // Some browsers only allow showPicker from a direct pointer action.
    }
  };

  const availabilityPayload = {
    bungalowId: form.bungalowId,
    room_type: form.room_type,
    check_in: form.check_in,
    check_out: form.check_out,
    guests_count: form.guests_count,
  };

  const checkSelectedAvailability = async () => {
    setChecking(true);

    try {
      const res = await checkAvailability(availabilityPayload);

      setAvailability(res.data);
      setAvailableRooms(res.data.rooms || []);
    } catch (error) {
      setAvailability({
        available: false,
        message:
          error.response?.data?.message ||
          "Unable to check availability",
      });
      setAvailableRooms([]);
    } finally {
      setChecking(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!availability?.available) {
      await checkSelectedAvailability();
      return;
    }

    if (form.approvalForm?.type !== "application/pdf") {
      alert("Please upload the approval form as a PDF.");
      return;
    }

    const payload = new FormData();

    payload.append("bungalowId", form.bungalowId);
    payload.append("room_type", form.room_type);
    payload.append("check_in", form.check_in);
    payload.append("check_out", form.check_out);
    payload.append("guests_count", form.guests_count);
    payload.append("purpose", form.purpose);
    payload.append("form", form.approvalForm);

    setSubmitting(true);

    try {
      await createBooking(payload);

      alert("Booking Submitted for Approval");

      setForm({
        bungalowId: "",
        room_type: "",
        check_in: "",
        check_out: "",
        guests_count: 1,
        purpose: "",
        approvalForm: null,
      });
      setAvailability(null);
      setAvailableRooms([]);
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Unable to submit booking",
      );
    } finally {
      setSubmitting(false);
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
              <h2>Create Booking</h2>
              <p>Select a bungalow, accommodation type, dates, and guests.</p>
            </div>
          </div>

          <form className="form-panel" onSubmit={submit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Bungalow</label>

                <select
                  className="form-select"
                  required
                  value={form.bungalowId}
                  onChange={(e) => updateForm("bungalowId", e.target.value)}
                >
                  <option value="">Select Bungalow</option>

                  {bungalows.map((bungalow) => (
                    <option key={bungalow.id} value={bungalow.id}>
                      {bungalow.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label">Room Type</label>

                <select
                  className="form-select"
                  required
                  disabled={!form.bungalowId}
                  value={form.room_type}
                  onChange={(e) => updateForm("room_type", e.target.value)}
                >
                  <option value="">Select Room Type</option>

                  {roomTypes.map((type) => (
                    <option key={type} value={type}>
                      {roomTypeLabels[type] || type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-3">
                <label className="form-label">Check In</label>

                <input
                  type="date"
                  className="form-control booking-date-input"
                  required
                  value={form.check_in}
                  onClick={openDatePicker}
                  onFocus={openDatePicker}
                  onChange={(e) => updateForm("check_in", e.target.value)}
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">Check Out</label>

                <input
                  type="date"
                  className="form-control booking-date-input"
                  required
                  value={form.check_out}
                  onClick={openDatePicker}
                  onFocus={openDatePicker}
                  onChange={(e) => updateForm("check_out", e.target.value)}
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">Guest Count</label>

                <input
                  type="number"
                  min="1"
                  className="form-control"
                  required
                  value={form.guests_count}
                  onChange={(e) => updateForm("guests_count", e.target.value)}
                />
              </div>

              <div className="col-md-3 d-flex align-items-end">
                <button
                  className="btn btn-outline-success w-100"
                  type="button"
                  disabled={
                    checking ||
                    !form.bungalowId ||
                    !form.room_type ||
                    !form.check_in ||
                    !form.check_out ||
                    !form.guests_count
                  }
                  onClick={checkSelectedAvailability}
                >
                  {checking ? "Checking..." : "Check Availability"}
                </button>
              </div>

              {availability && (
                <div className="col-12">
                  <div
                    className={`booking-availability ${
                      availability.available
                        ? "booking-availability-success"
                        : "booking-availability-error"
                    }`}
                  >
                    <strong>{availability.message}</strong>

                    {availableRooms.length > 0 && (
                      <span>
                        {availableRooms.length} option
                        {availableRooms.length === 1 ? "" : "s"} found.
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="col-md-8">
                <label className="form-label">Visit Purpose</label>

                <textarea
                  className="form-control"
                  rows="4"
                  required
                  disabled={!availability?.available}
                  value={form.purpose}
                  placeholder="Official visit, training program, family stay..."
                  onChange={(e) => updateForm("purpose", e.target.value)}
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Approval Form</label>

                <input
                  type="file"
                  className="form-control"
                  accept="application/pdf"
                  required
                  disabled={!availability?.available}
                  onChange={(e) =>
                    updateForm("approvalForm", e.target.files?.[0] || null)
                  }
                />
              </div>

              <div className="col-12 quick-actions">
                <button
                  className="btn btn-success"
                  type="submit"
                  disabled={submitting || !availability?.available}
                >
                  {submitting ? "Submitting..." : "Submit for Approval"}
                </button>
              </div>
            </div>
          </form>
        </main>
      </div>
    </>
  );
}
