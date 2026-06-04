import api from "./axios";

export const myBookings =
()=> api.get(
"/bookings/my-bookings"
);

export const createBooking =
(data)=> api.post(
"/bookings/create",
data
);