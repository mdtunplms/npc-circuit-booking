const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Booking = sequelize.define("Booking", {

  check_in: {
    type: DataTypes.DATE
  },

  check_out: {
    type: DataTypes.DATE
  },

  form_file: {
    type: DataTypes.STRING
  },

  status: {
    type: DataTypes.ENUM(
      "PENDING",
      "APPROVED",
      "REJECTED"
    ),
    defaultValue: "PENDING"
  }
});

module.exports = Booking;