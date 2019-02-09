const Sequelize = require("sequelize");
const sequelize = require("../db");

const Song = sequelize.define(
  "song",
  {
    title: Sequelize.TEXT,
    artist: Sequelize.TEXT,
    album: Sequelize.TEXT
  },
  { tableName: "songs" }
);

module.exports = Song;
