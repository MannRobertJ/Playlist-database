const Sequelize = require("sequelize");
const sequelize = require("../db");
const User = require("../users/model");

const Playlist = sequelize.define(
  "playlist",
  {
    name: Sequelize.STRING(255),
    userId: {
      type: Sequelize.INTEGER,
      field: "user_id"
    }
  },
  { tableName: "playlists" }
);

Playlist.belongsTo(User);

module.exports = Playlist;
