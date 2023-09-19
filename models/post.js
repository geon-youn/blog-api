const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  title: { required: true, type: String },
  text: { required: true, type: String },
  author: { required: true, type: Schema.Types.ObjectId, ref: 'User' },
  created: { required: true, type: Date },
  modified: { requried: true, type: Date },
  published: { required: true, type: Boolean },
});

module.exports = mongoose.model('Post', postSchema);
