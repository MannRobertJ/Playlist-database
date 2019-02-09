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

router.put("/playlists/:playlistId/songs/:songId", (req, res, next) => {
  const auth =
    req.headers.authorization && req.headers.authorization.split(" ");

  newPlayListId = req.body.PlaylistId
    ? req.body.newPlaylistId
    : req.params.playlistId;

  const moveSongToNewPlaylist = (song, playlist) => {
    return song
      .update(req.body)
      .then(song => res.send({ message: `Song edited` }));
  };

  const findNewPlayList = (userId, playlist, song, newPlaylistId) => {
    Playlist.findOne({ userId: userId, id: newPlaylistId })
      .then(newPlaylist => {
        if (!newPlaylist) {
          return res.status(404).send({ message: `Song does not exist` });
        }
        moveSongToNewPlaylist(song, newPlaylist);
      })
      .catch(error => next(error));
  };

  const findCurrentPlaylist = (userId, playlistId, song) => {
    Playlist.findOne({ userId: userId, id: playlistId })
      .then(playlist => {
        if (
          !playlist ||
          playlist.id !== song.playlistId ||
          playlist.userId !== userId
        ) {
          return res.status(404).send({
            message: `Song does not exist`
          });
        }
        findNewPlayList(userId, playlist, song, newPlayListId);
      })
      .catch(error => next(error));
  };

  const findSong = (userId, playlistId, songId) => {
    Song.findById(songId)
      .then(song => {
        if (!song || song.playlistId !== playlistId) {
          return res.status(404).send({
            message: `Song does not exist`
          });
        }
        findCurrentPlaylist(userId, playlistId, song);
      })
      .catch(error => next(error));
  };

  if (auth && auth[0] === "Bearer" && auth[1]) {
    try {
      const data = toData(auth[1]);
      findSong(
        Number(data.userId),
        Number(req.params.playlistId),
        Number(req.params.songId)
      );
    } catch (error) {
      res.status(400).send({
        Error: `Error ${error.name}: ${error.message}`
      });
    }
  } else {
    res
      .status(401)
      .send({
        message: "Please supply some valid credentials"
      })
      .catch(error => next(error));
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
          message: `Song does not exist`
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
      findSong(Number(data.userId), req.params.playlistId, req.params.songId);
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
