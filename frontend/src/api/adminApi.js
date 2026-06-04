import api from "./axios";

export const getPendingBookings = () =>
  api.get("/admin/bookings");

export const approveBooking = (id) =>
  api.put(`/admin/bookings/${id}/approve`);

export const rejectBooking = (id) =>
  api.put(`/admin/bookings/${id}/reject`);

export const occupancyReport = () =>
  api.get(
    "/bungalow-admin/occupancy-report"
  );