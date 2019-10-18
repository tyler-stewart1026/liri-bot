require("dotenv").config();

var keys = require("./keys")

var spotify = new Spotify(keys.spotify);

var omdb = new omdb(key.omdb);
