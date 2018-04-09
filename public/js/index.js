let socket = io();
socket.on('connect', () => {
  console.log('connected to io')
});

socket.on('disconnect', () => {
  console.log('disconnected form io')
});

socket.on('newMessage', (message) => {
  console.log('new message: ', message);
  let li = jQuery('<li></li>');
  li.text(`${message.from}: ${message.text}`);
  jQuery('#messages').append(li);
});
  
  socket.on('newLocationMessage', (message) => {
    let li = jQuery('<li></li>');
    let a = jQuery('<a target="_blank">I\'m Here!</a>');
    
    li.text(`${message.from}: `);
    a.attr('href', message.url);
    li.append(a);
    jQuery('#messages').append(li);
  });
  
  jQuery('#message-form').on('submit', (e) => {
    e.preventDefault();
    socket.emit('createMessage', {
      from: 'Toad',
      text: jQuery('[name=message]').val()
    },
    () => {
      console.log('it worked');
    });
  });
  
  let locationButton = jQuery('#send-map');
  locationButton.on('click', () => {
    console.log('clicked!');
    if (!navigator.geolocation) {
      return console.log('geolocation not supported');
    };
    navigator.geolocation.getCurrentPosition( (position) => {
      console.log(position);
      socket.emit('createLocationMessage', {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
      
    },
    () => {
      console.log('unable to fetch location');
    });
  });