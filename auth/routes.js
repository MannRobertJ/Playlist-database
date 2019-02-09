const { auth } = require("./middleware");
const { Router } = require("express");
const User = require("../users/model");
const router = new Router();
const bcrypt = require("bcrypt");
const { toJWT, toData } = require("./jwt");

router.post("/logins", (req, res) => {
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

// When I try to implement the middleware as explained in the reader it breaks.

/* router.get("/secret-endpoint", auth, (req, res) => {
  res.send({
    message: `Thanks for visiting the secret endpoint ${req.user.email}.`
  });
}); */

module.exports = router;
