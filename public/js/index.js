let socket = io();
socket.on('connect', () => {
  console.log('connected to io')
  socket.emit('createMessage', {
    to: "group 1",
    text: "I'm here"
  });
});

socket.on('disconnect', () => {
  console.log('disconnected form io')
});

socket.on('newMessage', (message) => {
  console.log('new message: ', message);
});
