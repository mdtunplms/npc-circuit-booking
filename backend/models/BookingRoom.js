const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const BookingRoom = sequelize.define("BookingRoom", {

  room_price: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false
  }

});

module.exports = BookingRoom;