const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define("User", {
  full_name: {
    type: DataTypes.STRING,
    allowNull: false
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false
  },

  institution: {
    type: DataTypes.STRING
  },

  mobile_no: {
    type: DataTypes.STRING
  },

  role: {
    type: DataTypes.ENUM(
      "SUPER_ADMIN",
      "ADMIN",
      "USER"
    ),
    defaultValue: "USER"
  }
});

module.exports = User;