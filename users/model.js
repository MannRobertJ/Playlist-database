const Sequelize = require("sequelize");
const sequelize = require("../db");

const User = sequelize.define(
  "user",
  {
    email: Sequelize.TEXT,
    password: Sequelize.TEXT
  },
  { tableName: "customers" }
);

module.exports = User;
