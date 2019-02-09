const { Router } = require("express");
const Playlist = require("./model");

const router = new Router();

router.get("/playlists", (req, res, next) => {
  const limit = req.query.limit || 25;
  const offset = req.query.offset || 0;

  Promise.all([Playlist.count(), Playlist.findAll({ limit, offset })])
    .then(([total, playlists]) => {
      res.send({
        playlists,
        total
      });
    })
    .catch(error => next(error));
});

module.exports = router;
