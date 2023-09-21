const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  text: { required: true, type: String },
  author: { required: true, type: Schema.Types.ObjectId, ref: 'User' },
  post: { required: true, type: Schema.Types.ObjectId, ref: 'Post' },
  replyTo: { type: Schema.Types.ObjectId, ref: 'Comment' },
  created: { required: true, type: Date },
  modified: { type: Date },
  deleted: { required: true, type: Boolean },
});

module.exports = mongoose.model('Comment', commentSchema);
