const User = require("./User");
const Bungalow = require("./Bungalow");
const Room = require("./Room");
const Booking = require("./Booking");
const BookingRoom = require("./BookingRoom");


// Bungalow -> Rooms

Bungalow.hasMany(Room);
Room.belongsTo(Bungalow);


// User -> Bookings

User.hasMany(Booking);
Booking.belongsTo(User);


// Bungalow -> Bookings

Bungalow.hasMany(Booking);
Booking.belongsTo(Bungalow);


// Booking -> Rooms

Booking.belongsToMany(
  Room,
  {
    through: BookingRoom,
    as: "rooms"
  }
);

Room.belongsToMany(
  Booking,
  {
    through: BookingRoom,
    as: "bookings"
  }
);

module.exports = {
  User,
  Bungalow,
  Room,
  Booking,
  BookingRoom
};