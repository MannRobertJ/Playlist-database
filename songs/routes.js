const { Router } = require("express");
const Song = require("./model");

const router = new Router();

router.get("/songs", (req, res, next) => {
  const limit = req.query.limit || 25;
  const offset = req.query.offset || 0;

  Promise.all([Song.count(), Song.findAll({ limit, offset })])
    .then(([total, songs]) => {
      res.send({
        songs,
        total
      });
    })
    .catch(error => next(error));
});

module.exports = router;
