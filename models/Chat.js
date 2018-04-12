const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ChatSchema = new Schema({
  from: String,
  text: String,
  createdAt: {type: Date, default: Date.now},
});

let Chat = mongoose.model('Message', ChatSchema);
module.exports = Chat;