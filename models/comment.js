const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  text: { type: String },
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  post: { required: true, type: Schema.Types.ObjectId, ref: 'Post' },
  replyTo: { type: Schema.Types.ObjectId, ref: 'Comment' },
  created: { required: true, type: Date },
});

module.exports = mongoose.model('Comment', commentSchema);
