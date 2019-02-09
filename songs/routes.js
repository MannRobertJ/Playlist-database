const { Router } = require("express");
const Song = require("./model");
const Playlist = require("../playlists/model");
const { toData } = require("../auth/jwt");
const router = new Router();

router.post("/playlists/:id/songs", (req, res, next) => {
  const auth =
    req.headers.authorization && req.headers.authorization.split(" ");
  const playlistID = req.params.id;

  const addSongToPlaylist = (playlistId, userId) => {
    Playlist.findById(req.params.id)
      .then(playlist => {
        if (!playlist) {
          return res.status(404).send({
            message: `playlist does not exist`
          });
        }
        Song.create({ ...req.body, playlistId: playlistId })
          .then(song => {
            return res.send(song);
            if (!song) {
              return res.status(404).send({
                message: `Song does not exist`
              });
            }
            return res.status(201).send(song);
          })
          .catch(error => next(error));
      })
      .catch(error => next(error));
  };

  if (auth && auth[0] === "Bearer" && auth[1]) {
    try {
      const data = toData(auth[1]);
      addSongToPlaylist(req.params.id, data.userId);
    } catch (error) {
      res.status(400).send({
        Error: `Error ${error.name}: ${error.message}`
      });
    }
  } else {
    res.status(401).send({
      message: "Please supply some valid credentials"
    });
  }
});

router.delete("/playlists/:playlistId/songs/:songId", (req, res, next) => {
  const auth =
    req.headers.authorization && req.headers.authorization.split(" ");

  const deleteSong = (userId, playlistId, song) => {
    Playlist.findOne({ userId: userId, id: playlistId }).then(playlist => {
      if (
        !playlist ||
        playlist.id !== song.playlistId ||
        playlist.userId !== userId
      ) {
        return res.status(404).send({
          message: `${!playlist} ||
        ${playlist.id !== song.playlistId} ||
        ${playlist.userId !== userId} ${playlist.id} ${song.playlistId}`
        });
      }
      song.destroy().then(() => res.send({ message: `Song was destroyed` }));
    });
  };

  const findSong = (userId, playlistId, songId) => {
    Song.findOne({ id: songId, playlistId: playlistId }).then(song => {
      if (!song) {
        return res.status(404).send({ message: `Song does not exist` });
      }
      deleteSong(userId, playlistId, song);
    });
  };

  if (auth && auth[0] === "Bearer" && auth[1]) {
    try {
      const data = toData(auth[1]);
      findSong(Number(data.userId, req.params.playlistId, req.params.songId));
    } catch (error) {
      res.status(400).send({
        Error: `Error ${error.name}: ${error.message}`
      });
    }
  } else {
    res.status(401).send({
      message: "Please supply some valid credentials"
    });
  }
});

module.exports = router;
