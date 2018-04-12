const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChatSchema = new Schema({
  from: String,
  text: String,
  createdAt: {type: Date, default: Date.now},
});

const Chat = mongoose.model('Message', ChatSchema);
module.exports = Chat;