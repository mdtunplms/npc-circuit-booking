const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Room = sequelize.define("Room", {

  room_number: {
    type: DataTypes.STRING
  },

  room_type: {
    type: DataTypes.ENUM("AC","NON_AC")
  },

  price: {
    type: DataTypes.FLOAT
  }
});

module.exports = Room;