// Require
// ============================================
require("dotenv").config();
var Spotify = require("node-spotify-api")
var keys = require("./keys");
var axios = require("axios");
// console.log(keys);
// Variables
// ============================================
var spotify = new Spotify(keys.spotify);

var omdb = process.env.OMDB_KEY;
// console.log(omdb);
var selector = process.argv[2]
var args = process.argv;
var movieArg = "";
var songName = "";



var spotifyThis = function () {

  for (var i = 3; i < args.length; i++) {

    if (i > 3 && i < args.length) {
      songName = songName + "+" + args[i];
    } else {
      songName += args[i];
    }
  }
  console.log(songName)

  spotify.search({
    type: "track",
    query: songName,
    limit: 1
  }, function (err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
    // console.log(data);
      console.log(data.tracks.items.album)
      // console.log(data.tracks.items.artist)
  });

}

var movieThis = function () {
  movieArg = process.argv[3];
  queryUrl = ("http://www.omdbapi.com/?t=" + movieArg + "&apikey=" + omdb)
  axios.get(queryUrl).then(function (response) {
    console.log("success!" + response.data.imdbRating)
  }).catch(function (error) {
    if (error.response) {
      console.log("---------------Data---------------");
      console.log(error.response.data);
      console.log("---------------Status---------------");
      console.log(error.response.status);
      console.log("---------------Status---------------");
      console.log(error.response.headers);
    } else if (error.request) {
      console.log(error.request);
    } else {
      console.log("Error", error.message);
    }
    console.log(error.config);
  })
}





switch (selector) {
  case "spotify-this-song":
    spotifyThis();
    break;
  case "movie-this":
    movieThis();
    break;
  case "concert-this":
    concertThis();
    break;
  case "do-what-it-says":
    doWhatItSays();
    break;
}