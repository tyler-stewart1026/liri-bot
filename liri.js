// Require
// ============================================
require("dotenv").config();
var Spotify = require("node-spotify-api")
var keys = require("./keys");
var axios = require("axios");
var moment = require("moment");
var fs = require("fs");


// Variables
// ============================================
var spotify = new Spotify(keys.spotify);

var omdb = process.env.OMDB_KEY;
// console.log(omdb);
var selector = process.argv[2]
var args = process.argv;
var movieName = "";
var songName = "";
var artistName = "";
var date = "";
var queryUrl;


// Spotify Function
// ==============================
var spotifyThis = function () {

  for (var i = 3; i < args.length; i++) {

    if (i > 3 && i < args.length) {
      songName = songName + "+" + args[i];
    } else {
      songName += args[i];
    }
  }
  // console.log(songName)

  spotify.search({
    type: "track",
    query: songName,
    limit: 1
  }, function (err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
    // console.log(data);
    console.log("Song Data:")
    console.log("\n============")
    console.log("\nSong Name: " + data.tracks.items[0].name)
    console.log("\nArtist: " + data.tracks.items[0].album.artists[0].name)
    console.log("\nAlbum: " + data.tracks.items[0].album.name)
    console.log("\nRelease Date: " + data.tracks.items[0].album.release_date)
    console.log("\nSong Preview: " + data.tracks.items[0].external_urls.spotify)
  });

}

// Movie Function
// ===========================================
var movieThis = function () {

  // console.log("for loop" + args.length)
  if (args.length > 3) {

    for (var i = 3; i < args.length; i++) {
      if (i > 3 && i < args.length) {
        movieName = movieName + "+" + args[i];
        // console.log("if movie name")
      } else {
        // console.log("else movie name")
        movieName += args[i];
      }


    }
  } else {
    movieName = "Mr.Nobody"
  }
  // console.log("Movie name" + movieName)

  queryUrl = ("http://www.omdbapi.com/?t=" + movieName + "&apikey=" + omdb)
  axios.get(queryUrl).then(function (response) {
    console.log("OMDB API")
    console.log("===================")
    console.log("\nTitle: " + response.data.Title)
    console.log("\nReleased: " + response.data.Year)
    console.log("\nActors: " + response.data.Actors)
    console.log("\n" + response.data.Ratings[0].Source + ": " + response.data.Ratings[0].Value)
    console.log("\n" + response.data.Ratings[1].Source + ": " + response.data.Ratings[1].Value)
    console.log("\n" + response.data.Ratings[2].Source + ": " + response.data.Ratings[2].Value)
    console.log("\nLanguage: " + response.data.Language)
    console.log("\nCountry: " + response.data.Country)
    console.log("\nPlot: " + response.data.Plot)

  }).catch(function (error) {
    if (error.response) {
      console.log("---------------Data-----------------");
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



var concertThis = function () {


  for (var i = 3; i < args.length; i++) {

    if (i > 3 && i < args.length) {
      artistName = artistName + "+" + args[i];
    } else {
      artistName += args[i].toLowerCase();
    }
  }

  // console.log(artistName)
  queryUrl = "https://rest.bandsintown.com/artists/" + artistName + "/events?app_id=codingbootcamp"
  axios.get(queryUrl).then(function (response) {
    // console.log(JSON.stringify(response.data, null, 2));

    if (response.data.length === 0) {
      console.log("Sorry, the band you selected is not touring currently!")
    }else {

    console.log("\nVenue name: " + response.data[0].venue.name)
    console.log("\nLocation: " + response.data[0].venue.city + ", " + response.data[0].venue.region)
    var date = response.data[0].datetime;
    var time = moment(date).format('MM/DD/YYYY');
    console.log("\nDate: " + time);
}


  }).catch(function (error) {
    if (error) {
      console.log(error);
    }
  })
}


var doWhatItSays = function () {
  fs.readFile("random.txt", "utf8", function (error, data) {
    if (error) {
      console.log(error)
    }
    var output = data.split(",");
    console.log(output[0]);
    console.log(output[1]);

    if (output[0] === "spotify-this-song") {
      songName = output[1]
      // console.log(songName)
      spotifyThis();
    } else if (output[0] === "movie-this") {
      movieName = output[1]
      movieThis();
    } else if (output[0] === "concert-this") {
      artistName = output[1]
      // console.log(artistName)
      concertThis();
    }
  })
}




// Switch
// ==========================================
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
  default:
    console.log("Please choose a correct function")
    console.log("spotify-this-song")
    console.log("movie-this")
    console.log("concert-this")
    console.log("do-what-it-says")
}