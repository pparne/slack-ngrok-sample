'use strict';

require('dotenv').config();

var express = require('express');
var request = require('request');

// First we need to import the HTTP module.
// This module contains all the logic for dealing with HTTP requests.
var http = require('http');

var app = express();

// We define the port we want to listen to.
// Logically this has to be the same port that we specified on ngrok.
const PORT=process.env.PORT;
const CLIENT_ID=process.env.SLACKAPP_CLIENT_ID;
const CLIENT_SECRET=process.env.SLACKAPP_CLIENT_SECRET;

// start our server.
app.listen(PORT, function() {
  console.log("App listening on port %s", PORT);
});

// create a function which handles any requests and sends a simple response
app.get('/', function(request, response){
  console.log("Ngrok is working! path hit: " + request.url);
});

// get request to an oauth endpoint
app.get('/oauth', function(req, res) {
  if (!req.query.code) {
      res.status(500);
      res.send({"Error": "Looks like we're not getting code."});
      console.log("Looks like we're not getting code.");
  } else {
    request({
      url: 'https://slack.com/api/oauth.access',
      qs: { code: req.query.code, client_id: CLIENT_ID, client_secret: CLIENT_SECRET },
      method: 'GET',
    }, function(error, response, body) {
      if (error) {
        console.log(error);
      } else {
        res.json(body);
      }
    })
  }
})

app.post('/command', function(req, res) {
  res.send('Your ngrok tunnel is up and running!');
})

// // We create the web server object calling the createServer funciton.
// // Passing our request function onto createServer guarantess the
// // function is called once for every HTTP request that's made against the server.
// var server = http.createServer(handleRequest);

// // Finally we start the server
// server.listen(PORT, function() {
//   // Callback triggered when server is successfully listening. Hurray!
//   console.log("Server listening on: http://localhost:%s", PORT);
// });