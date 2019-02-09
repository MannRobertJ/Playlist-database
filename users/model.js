const Sequelize = require("sequelize");
const sequelize = require("../db");

const User = sequelize.define(
  "user",
  {
    email: {
      type: Sequelize.STRING(255),
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: Sequelize.STRING(255)
  },
  { tableName: "users" }
);

module.exports = User;
