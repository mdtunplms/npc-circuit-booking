import api from "./axios";

export const occupancyReport = () =>
  api.get(
   "/bungalow-admin/occupancy-report"
  );

export const todayCheckins = () =>
  api.get(
   "/bungalow-admin/today-checkins"
  );

export const todayCheckouts = () =>
  api.get(
   "/bungalow-admin/today-checkouts"
  );