const mongoose = require ('mongoose');

mongoose.connect( process.env.MONGODB_URI || 'mongodb://localhost/rightHere', (err) => {
  if(err) {
    console.log(err);
  } else {
    console.log('connected to mongodb');
  }
});

module.exports.Chat = require('./Chat');
module.exports.User = require('./User');