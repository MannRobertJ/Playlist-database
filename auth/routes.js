const { Router } = require("express");
const User = require("../users/model");
const router = new Router();
const bcrypt = require("bcrypt");
const { toJWT, toData } = require("./jwt");

router.post("/logins", (req, res, next) => {
  User.findOne({
    where: {
      email: req.body.email
    }
  })
    .then(entity => {
      if (!entity) {
        res.status(400).send({
          message: "Email or password is incorrect"
        });
      }
      if (bcrypt.compareSync(req.body.password, entity.password)) {
        res.send({
          jwt: toJWT({ userId: entity.id })
        });
      } else {
        res.status(400).send({
          message: "Email or password is incorrect"
        });
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).send({
        message: "Something went wrong"
      });
    });
});

router.get("/secret-endpoint", (req, res) => {
  const auth =
    req.headers.authorization && req.headers.authorization.split(" ");
  if (auth && auth[0] === "Bearer" && auth[1]) {
    try {
      const data = toData(auth[1]);
      res.send({
        message: "Thanks for visiting the secret endpoint.",
        data
      });
    } catch (error) {
      res.status(400).send({
        message: `Error ${error.name}: ${error.message}`
      });
    }
  } else {
    res.status(401).send({
      message: "Please supply some valid credentials"
    });
  }
});

module.exports = router;
