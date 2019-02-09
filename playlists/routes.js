const { Router } = require("express");
const Playlist = require("./model");
const User = require("../users/model");
const { toData } = require("../auth/jwt");
const router = new Router();

router.get("/playlists", (req, res, next) => {
  const auth =
    req.headers.authorization && req.headers.authorization.split(" ");

  const limit = req.query.limit || 25;
  const offset = req.query.offset || 0;

  const getPlaylistsByUserId = userId => {
    Playlist.findAll({ where: { userId: userId } })
      .then(playlists => {
        return res.send({
          message: playlists
        });
      })
      .catch(error => next(error));
  };

  if (auth && auth[0] === "Bearer" && auth[1]) {
    try {
      const data = toData(auth[1]);
      getPlaylistsByUserId(data.userId);
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

router.get("/playlists/:id", (req, res, next) => {
  const auth =
    req.headers.authorization && req.headers.authorization.split(" ");

  const getPlaylist = (id, userId) => {
    Playlist.findOne({ userId: userId, id: id })
      .then(playlist => {
        if (!playlist) {
          return res.status(404).send({ message: `Playlist does not exist` });
        }
        return res.send(playlist);
      })
      .catch(error => next(error));
  };

  if (auth && auth[0] === "Bearer" && auth[1]) {
    try {
      const data = toData(auth[1]);
      getPlaylist(Number(req.params.id), data.userId);
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

router.post("/playlists", (req, res, next) => {
  const auth =
    req.headers.authorization && req.headers.authorization.split(" ");

  const createPlaylist = userId => {
    newPlaylist = { ...req.body, userId: userId };

    Playlist.create(newPlaylist)
      .then(playlist => {
        if (!playlist) {
          return res.status(404).send({ message: `Playlist does not exist` });
        }
        return res.status(201).send(playlist);
      })
      .catch(error => next(error));
  };

  if (auth && auth[0] === "Bearer" && auth[1]) {
    try {
      const data = toData(auth[1]);
      createPlaylist(data.userId);
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

router.delete("/playlists/:id", (req, res, next) => {
  const auth =
    req.headers.authorization && req.headers.authorization.split(" ");

  const deletePlaylist = (id, userId) => {
    Playlist.findOne({ userId: userId, id: id })
      .then(playlist => {
        if (!playlist && playlist.userId !== userId) {
          return res.status(404).send({ message: `Playlist does not exist` });
        }
        return playlist
          .destroy()
          .then(() => res.send({ message: `Playlist was destroyed` }));
      })
      .catch(error => next(error));
  };

  if (auth && auth[0] === "Bearer" && auth[1]) {
    try {
      const data = toData(auth[1]);
      deletePlaylist(Number(req.params.id), data.userId);
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
