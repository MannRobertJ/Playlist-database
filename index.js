const express = require("express");
const bodyParser = require("body-parser");
const usersRouter = require("./users/routes");
const playlistsRouter = require("./playlists/routes");
const songsRouter = require("./songs/routes");
const authRouter = require("./auth/routes");
const auth = require("./auth/middleware");
const app = express();
const port = process.env.PORT || 4000;

app
  .use(bodyParser.json())
  .use(usersRouter, playlistsRouter, songsRouter, authRouter)
  .listen(port, () => console.log(`Listening on port ${port}`));
