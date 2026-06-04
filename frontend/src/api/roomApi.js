import api from "./axios";

export const getRooms = () => {

  return api.get("/rooms");

};