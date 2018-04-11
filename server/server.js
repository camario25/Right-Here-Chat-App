const path = require('path');
const http = require('http');
const express = require('express');

const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message.js')
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
let app = express();
let server = http.createServer(app);
let io = socketIO(server);

app.get("/", function(req, res) {
  res.sendFile(publicPath + '/index.html');
});
app.use(express.static(publicPath));



io.on('connection', (socket) => {
  console.log('user connected');
  
  socket.emit('newMessage', generateMessage('admin', 'welcome to Right Here'));
  socket.broadcast.emit('newMessage', generateMessage('admin', 'New user joined'));
  
  socket.on('createMessage', (newMessage, callback) => {
    console.log('createMessage:', newMessage);
    io.emit('newMessage', generateMessage(newMessage.from, newMessage.text));
    callback();
  });
  
  socket.on('createLocationMessage', (coords) => {
    io.emit('newLocationMessage', generateLocationMessage('Wario', coords.latitude, coords.longitude));
  });
  
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});



server.listen(port, () => {
  console.log(`Http server listening at ${port}`);
});