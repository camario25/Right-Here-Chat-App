// let socket = io();
// 
// jQuery('.username-form').on('submit', (e) => {
//   e.preventDefault();
//   console.log('user sent');
//   let username = jQuery('#username-box');
//   socket.emit('new user', username.val(), (data) => {
//     if (data) {
//       jQuery('#username-input').hide();
//       jQuery('#main-msg').show();
//     } else {
//       jQuery('#usernameError').html('Username is already taken!')
//     }
//   });
//   username.val('');
// });