const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Room = sequelize.define("Room", {

  room_number: {
    type: DataTypes.STRING,
    allowNull: false
  },

  room_type: {
    type: DataTypes.ENUM(
      "AC",
      "NON_AC"
    ),
    allowNull: false
  },

  max_guests: {
    type: DataTypes.INTEGER,
    defaultValue: 2
  },

  price: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false
  },

  status: {
    type: DataTypes.ENUM(
      "AVAILABLE",
      "MAINTENANCE"
    ),
    defaultValue: "AVAILABLE"
  }

});

module.exports = Room;