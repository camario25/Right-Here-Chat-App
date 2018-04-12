const path = require('path');
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const db = require('../models/index.js');
const socketIO = require('socket.io');
const Chat = db.Chat;

const {generateMessage, generateLocationMessage} = require('./utils/message.js')
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
let app = express();
let server = http.createServer(app);
let io = socketIO(server);
let usernames = [];

mongoose.connect( process.env.MONGODB_URI || 'mongodb://localhost/rightHere', (err) => {
  if(err) {
    console.log(err);
  } else {
    console.log('connected to mongodb');
  }
});


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
  let oldMessages = Chat.find({});
  oldMessages.sort('-createdAt').limit(12).exec((err, docs) => {
    if(err) throw err;
    console.log('send old');
    socket.emit('load saved messages', docs);
  });
  
  socket.on('new user', (data, callback) => {
    if (usernames.indexOf(data) != -1) {
      callback(false);
    } else {
      callback(true);
      console.log(data);
      socket.username = data;
      usernames.push(socket.username);
      io.sockets.emit('usernames', usernames);
      socket.broadcast.emit('newMessage', generateMessage('Admin', `${socket.username} has joined the chat`));
    }
  });
  
  socket.on('createMessage', (newMessage, callback) => {
    console.log('createMessage:', newMessage);
    let newMsg = new Chat({from: socket.username, text: newMessage.text});
    newMsg.save((err) => {
      if(err) throw err;
    io.emit('newMessage', 
     generateMessage(socket.username, newMessage.text));
     callback();
     })
  });
  
  socket.on('createLocationMessage', (coords) => {
    io.emit('newLocationMessage', generateLocationMessage('Wario', coords.latitude, coords.longitude));
  });
  
  socket.on('disconnect', () => {
    console.log('user disconnected');
    if(!socket.username) return;
    usernames.splice(usernames.indexOf(socket.username), 1);
    socket.broadcast.emit('newMessage', generateMessage('Admin', `${socket.username} has left the chat`));
    io.sockets.emit('usernames', usernames);
  });
});



server.listen(port, () => {
  console.log(`Http server listening at ${port}`);
});