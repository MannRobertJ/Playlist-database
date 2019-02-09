const Sequelize = require("sequelize");
const sequelize = require("../db");
const Playlist = require("../playlists/model");

const Song = sequelize.define(
  "song",
  {
    title: Sequelize.STRING(255),
    artist: Sequelize.STRING(255),
    album: Sequelize.STRING(255),
    playlistId: {
      type: Sequelize.INTEGER,
      field: "playlist_id"
    }
  },
  { tableName: "songs" }
);

Song.belongsTo(Playlist);

module.exports = Song;
