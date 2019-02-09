const Sequelize = require("sequelize");
const sequelize = require("../db");

const Playlist = sequelize.define(
  "playlist",
  {
    name: Sequelize.STRING(255)
  },
  { tableName: "playlists" }
);

module.exports = Playlist;
