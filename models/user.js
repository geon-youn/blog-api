const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { required: true, type: String },
  password: { required: true, type: String },
  first_name: { required: true, type: String },
  last_name: { required: true, type: String },
});

userSchema.virtual('full_name').get(function () {
  return this.first_name + ' ' + this.last_name;
});

module.exports = mongoose.model('User', userSchema);
