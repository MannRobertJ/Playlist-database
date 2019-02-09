const Sequelize = require("sequelize");
const sequelize = require("../db");

const Playlist = sequelize.define(
  "playlist",
  {
    name: Sequelize.TEXT
  },
  { tableName: "playlists" }
);

module.exports = Playlist;
