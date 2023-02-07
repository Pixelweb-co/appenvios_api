
//libraies
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");


const port = 2042; //Default port
const app = express(); //Define the express app
const server = http.createServer(app); //Create server with express

const io = socketIo(server); //Initialize Socket

//Enabling JSON parser
app.use(bodyParser.json());


/** Socket Declarations */

var clients = []; //connected clients

io.on("connection", socket => {
  console.log("New User Connected");
  
  socket.emit("userList",{user:"edwin"})

  socket.on("disconnect", function(data) {
   
  });
});

//Let the server to listen
server.listen(port, () => console.log(`Listening on port ${port}`));