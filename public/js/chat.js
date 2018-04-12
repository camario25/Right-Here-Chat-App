let socket = io();

socket.on('connect', () => {
  console.log('connected to io')
});

socket.on('disconnect', () => {
  console.log('disconnected form io')
});

socket.on('newMessage', (message) => {
  console.log('new message: ', message);
  let formattedTime = moment(message.createdAt).format('h:mm a');
  let li = jQuery('<li></li>');
  li.text(`${message.from} ${formattedTime}: ${message.text}`);
  jQuery('#messages').append(li);
});
  
  socket.on('newLocationMessage', (message) => {
    let li = jQuery('<li></li>');
    let a = jQuery('<a target="_blank">I\'m Here!</a>');
    let formattedTime = moment(message.createdAt).format('h:mm a');
    li.text(`${message.from} ${formattedTime}: `);
    a.attr('href', message.url);
    li.append(a);
    jQuery('#messages').append(li);
  });
  
  jQuery('#message-form').on('submit', (e) => {
        console.log('test');
    console.log(e);
    e.preventDefault();
    
    let messageTextbox = jQuery('[name=message]');
    
    socket.emit('createMessage', {
      from: 'Toad',
      text: messageTextbox.val()
    },
    () => {
      console.log('it worked');
      messageTextbox.val('')
    });
  });
  
  jQuery('.username-form').on('submit', (e) => {
    e.preventDefault();
    let username = jQuery('#username-box');
    socket.emit('new user', username.val(), (data) => {
      if (data) {
        jQuery('#username-input').hide();
        jQuery('#main-msg').show();
      } else {
        jQuery('#usernameError').html('Username is already taken!')
      }
    });
    username.val('');
  });
  
  socket.on('usernames', (data) => {
    let users ='';
    let usersList = jQuery('#users-list');
    console.log(usersList);
    for (i=0;i<data.length;i++) {
      users += data[i] + '</br>'
    } 
    usersList.html(users);
    console.log(usersList);
  });
  
  let locationButton = jQuery('#send-map');
  locationButton.on('click', () => {
    console.log('clicked!');
    if (!navigator.geolocation) {
      return console.log('geolocation not supported');
    };
    
    locationButton.attr('disabled', 'disabled').text('Sending location...');
    
    navigator.geolocation.getCurrentPosition( (position) => {
      console.log(position);
      locationButton.removeAttr('disabled').text('I\'m Here');
      socket.emit('createLocationMessage', {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
      
    },
    () => {
      locationButton.removeAttr('disabled').text('I\'m Here');
      console.log('unable to fetch location');
    });
  });