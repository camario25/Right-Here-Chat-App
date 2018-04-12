const path = require('path');
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message.js')
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
let app = express();
let server = http.createServer(app);
let io = socketIO(server);
let usernames = [];

// mongoose.connect( process.env.MONGODB_URI || 'mongodb://localhost/righthere', (err) => {
//   if(err) {
//     console.log(err);
//   } else {
//     console.log('connected to mongodb');
//   }
// });
// 
// let ChatSchema = mongoose.Schema({
//   username: String,
//   msg: String,
//   created: {type: Date, default: Date.now},
// });
// 
// let Chat = mongoose.model('Message', ChatSchema);

app.get("/", function(req, res) {
  res.sendFile(publicPath + '/index.html');
});
// app.set('views', __dirname + '/views');
app.use(express.static(publicPath, {
  extensions: ['html']
}));
// app.use(bodyParser.urlencoded({ extended: true })); // req.body
// 
// // change engine
// app.set("view engine", "ejs");
// // methode overider
// // app.use(methodOverride("_method"));
// Set CORS Headers
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });



io.on('connection', (socket) => {
  console.log('user connected');
  
  socket.on('new user', (data, callback) => {
    if (usernames.indexOf(data) != -1) {
      callback(false);
    } else {
      callback(true);
      console.log(data);
      socket.username = data;
      usernames.push(socket.username);
      io.sockets.emit('usernames', usernames);
      socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));
    }
  });
  
  socket.on('createMessage', (newMessage, callback) => {
    console.log('createMessage:', newMessage);
    // let newMsg = new Chat()
    io.emit('newMessage', 
    // {text: newMessage, from: socket.username});
     generateMessage(socket.username, newMessage.text));
    // callback();
  });
  
  socket.on('createLocationMessage', (coords) => {
    io.emit('newLocationMessage', generateLocationMessage('Wario', coords.latitude, coords.longitude));
  });
  
  socket.on('disconnect', () => {
    console.log('user disconnected');
    if(!socket.username) return;
    usernames.splice(usernames.indexOf(socket.username), 1);
    io.sockets.emit('usernames', usernames);
  });
});



server.listen(port, () => {
  console.log(`Http server listening at ${port}`);
});