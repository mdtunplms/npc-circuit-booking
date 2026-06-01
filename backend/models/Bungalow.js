const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Bungalow = sequelize.define("Bungalow", {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },

  location: {
    type: DataTypes.STRING
  }
});

module.exports = Bungalow;