let socket = io();

jQuery('.Logout').on('click', () => {
  location.href = "/";
});

socket.on('connect', () => {

});

socket.on('disconnect', () => {

});

socket.on('load saved messages', (docs) => {
  for (let i = docs.length -1; i >= 0; i--) {
    let formattedTime = moment(docs[i].createdAt).format('h:mm a');
    let li = jQuery('<li></li>');
    li.html(`<b>${docs[i].from}</b> ${formattedTime}: ${docs[i].text}`);
    jQuery('#messages').append(li);
  }
});

socket.on('newMessage', (message) => {
  let formattedTime = moment(message.createdAt).format('h:mm a');
  let li = jQuery('<li></li>');
  li.html(`<b>${message.from}</b> ${formattedTime}: ${message.text}`);
  jQuery('#messages').append(li);
});
  
  socket.on('newLocationMessage', (message) => {
    let li = jQuery('<li></li>');
    let a = jQuery('<a target="_blank">Click MAP link: I\'m Right Here!</a>');
    let formattedTime = moment(message.createdAt).format('h:mm a');
    li.text(`${message.from} ${formattedTime}: `);
    a.attr('href', message.url);
    li.append(a);
    jQuery('#messages').append(li);
  });
  
  jQuery('#message-form').on('submit', (e) => {
    e.preventDefault();
    
    let messageTextbox = jQuery('[name=message]');
    
    socket.emit('createMessage', {
      text: messageTextbox.val()
    },
    () => {
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
    for (i=0;i<data.length;i++) {
      users += data[i] + '</br>'
    } 
    usersList.html(users);
  });
  
  let locationButton = jQuery('#send-map');
  locationButton.on('click', () => {
    if (!navigator.geolocation) {
      return console.log('geolocation not supported');
    };
    
    locationButton.attr('disabled', 'disabled').text('Sending location...');
    
    navigator.geolocation.getCurrentPosition( (position) => {
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