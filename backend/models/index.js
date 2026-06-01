const User = require("./User");
const Bungalow = require("./Bungalow");
const Room = require("./Room");
const Booking = require("./Booking");

Bungalow.hasMany(Room);
Room.belongsTo(Bungalow);

User.hasMany(Booking);
Booking.belongsTo(User);

Bungalow.hasMany(Booking);
Booking.belongsTo(Bungalow);

module.exports = {
  User,
  Bungalow,
  Room,
  Booking
};