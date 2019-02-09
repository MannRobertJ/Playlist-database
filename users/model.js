const Sequelize = require("sequelize");
const sequelize = require("../db");

const User = sequelize.define(
  "user",
  {
    email: Sequelize.TEXT,
    password: Sequelize.TEXT
  },
  { tableName: "users" }
);

module.exports = User;
