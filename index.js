const express = require("express");
const bodyParser = require("body-parser");
const usersRouter = require("./users/routes");
const playlistsRouter = require("./playlists/routes");

const app = express();
const port = process.env.PORT || 4000;

app
  .use(bodyParser.json())
  .use(usersRouter, playlistsRouter)
  .listen(port, () => console.log(`Listening on port ${port}`));
