import api from "./axios";

export const roomCalendar =
(roomId)=>

api.get(
`/calendar/room/${roomId}`
);

export const bungalowCalendar =
(bungalowId)=>

api.get(
`/calendar/bungalow/${bungalowId}`
);