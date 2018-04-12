const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let ChatSchema = mongoose.Schema({
  from: String,
  text: String,
  createdAt: {type: Date, default: Date.now},
});

let Chat = mongoose.model('Message', ChatSchema);
module.exports = Chat;