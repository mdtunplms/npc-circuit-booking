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

export const checkAvailability =
(data)=> api.post(
"/bookings/check-availability",
data
);

export const uploadForm = (id, formData) => {

  return api.post(
    `/bookings/${id}/upload-form`,
    formData,
    {
      headers: {
        "Content-Type":
        "multipart/form-data"
      }
    }
  );

};
