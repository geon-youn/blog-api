const asyncHandler = require('express-async-handler');
const { param, body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const { getToken } = require('./verification');
const Comment = require('../models/comment');
const Post = require('../models/post');

require('dotenv').config();

module.exports.createComment = [
  // Get jwt token
  getToken,

  // Validate input
  body('text').trim().isLength({ min: 1 }).withMessage('Text is required'),
  param('postid').isMongoId().withMessage('Invalid post id'),

  asyncHandler(async (req, res, next) => {
    // Check for input errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({
        errors: errors.array(),
      });
    }

    // Verify jwt token
    jwt.verify(req.token, process.env.secret, async (err, authData) => {
      if (err) {
        return res.json({
          message: "Couldn't verify jwt",
        });
      }
      const user = authData.user;

      // Find post
      const post = await Post.findById(req.params.postid);
      if (!post) {
        return res.json({
          message: "Couldn't find post",
        });
      }

      // Find parent comment (if applicable)
      if (req.params.parentid) {
        const parentComment = await Comment.findById(req.params.parentid);
        if (!parentComment) {
          return res.json({
            message: "Couldn't find parent comment",
          });
        }

        // Verify parent comment is for the same post
        else if (parentComment.post.toString() !== req.params.postid) {
          return res.json({
            message: 'Parent comment is for a different post',
          });
        }
      }

      // Create and save comment
      const comment = new Comment({
        text: req.body.text,
        author: user._id,
        post: req.params.postid,
        replyTo: req.params.parentid || undefined,
        created: new Date(),
        deleted: false,
      });
      await comment.save();

      return res.json({
        message: 'Created comment',
        comment,
      });
    });
  }),
];

module.exports.createReply = [
  // Validate `parentid`
  param('parentid').isMongoId().withMessage('Invalid parent comment id'),

  module.exports.createComment,
];

module.exports.getComments = [
  // Validate input
  param('postid').isMongoId().withMessage('Invalid post id'),

  asyncHandler(async (req, res, next) => {
    // Check for input errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({
        message: 'Invalid input',
        errors: errors.json(),
      });
    }

    // Find comments
    const [comments, deletedComments] = await Promise.all([
      Comment.find(
        { post: req.params.postid, deleted: false },
        'text replyTo created modified author'
      ).populate('author', 'username first_name last_name'),
      Comment.find(
        { post: req.params.postid, deleted: true },
        'replyTo created modified'
      ),
    ]);

    return res.json({
      comments: comments.concat(deletedComments),
    });
  }),
];

module.exports.updateComment = [
  // Get jwt token
  getToken,

  // Validate input
  body('text').trim().isLength({ min: 1 }).withMessage('Text is required'),
  param('commentid').isMongoId().withMessage('Invalid comment id'),

  asyncHandler(async (req, res, next) => {
    // Check for input errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({
        message: 'Invalid input',
        errors: errors.array(),
      });
    }

    // Find comment
    const comment = await Comment.findById(req.params.commentid);
    if (!comment || comment.deleted) {
      return res.json({
        message: "Couldn't find comment",
      });
    }

    // Verify route is called for author of comment
    jwt.verify(req.token, process.env.secret, async (err, authData) => {
      if (err) {
        return res.json({
          message: "Couldn't verify jwt",
          errors: err,
        });
      }
      const user = authData.user;
      if (user._id !== comment.author.toString()) {
        return res.sendStatus(403);
      }

      // Update and save comment
      const newComment = new Comment({
        ...comment,
        text: req.body.text,
        modified: new Date(),
        _id: comment._id,
      });
      await Comment.findByIdAndUpdate(req.params.commentid, newComment);

      return res.json({
        message: 'Successfully updated comment',
        comment: newComment,
      });
    });
  }),
];

module.exports.deleteComment = [
  // Get jwt token
  getToken,
  
  // Validate input
  param('commentid').isMongoId().withMessage('Invalid comment id'),

  asyncHandler(async (req, res, next) => {
    // Check for input errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({
        errors: errors.array(),
      });
    }

    // Find comment
    const comment = await Comment.findById(req.params.commentid);
    if (!comment || comment.deleted) {
      return res.json({
        message: "Couldn't find comment",
      });
    }

    // Verify route is called for author of comment
    jwt.verify(req.token, process.env.secret, async (err, authData) => {
      if (err) {
        return res.json({
          message: "Couldn't verify jwt",
          errors: err,
        });
      }
      const user = authData.user;
      if (user._id !== comment.author.toString()) {
        return res.sendStatus(403);
      }

      // Update comment (pseudo-delete)
      const newComment = new Comment({
        ...comment,
        modified: new Date(),
        deleted: true,
        _id: comment._id,
      });
      await Comment.findByIdAndUpdate(req.params.commentid, newComment);

      return res.json({
        message: 'Successfully removed comment',
      });
    });
  }),
];
