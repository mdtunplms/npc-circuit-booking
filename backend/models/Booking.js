const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Booking = sequelize.define("Booking", {

  check_in: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },

  check_out: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },

  guests_count: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },

  room_type: {
    type: DataTypes.ENUM(
      "AC",
      "NON_AC",
      "HALL"
    )
  },

  purpose: {
    type: DataTypes.TEXT
  },

  form_file: {
    type: DataTypes.STRING
  },

  total_amount: {
    type: DataTypes.DECIMAL(10,2),
    defaultValue: 0
  },

  booking_reference: {
    type: DataTypes.STRING,
    unique: true
  },

  status: {
 type: DataTypes.ENUM(
  "PENDING",
  "APPROVED",
  "REJECTED",
  "CANCELLED",
  "CHECKED_IN",
  "CHECKED_OUT",
  "COMPLETED"
 ),
 defaultValue:"PENDING"
}

});

module.exports = Booking;
