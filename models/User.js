const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let UserSchema = new Schema({
  username: {type:String, required: true},
  password: {type:String, required: true}
});

let User = mongoose.model('User', UserSchema);
module.exports = User;