let socket = io();
socket.on('connect', () => {
  console.log('connected to io')
});

socket.on('disconnect', () => {
  console.log('disconnected form io')
});

socket.on('newMessage', (message) => {
  console.log('new message: ', message);
});
