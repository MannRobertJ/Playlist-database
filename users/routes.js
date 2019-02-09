const { Router } = require("express");
const User = require("./model");

const router = new Router();

router.get("/users", (req, res, next) => {
  const limit = req.query.limit || 25;
  const offset = req.query.offset || 0;

  Promise.all([User.count(), User.findAll({ limit, offset })])
    .then(([total, users]) => {
      res.send({
        users,
        total
      });
    })
    .catch(error => next(error));
});

module.exports = router;
