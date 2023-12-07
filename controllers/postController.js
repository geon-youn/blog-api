const asyncHandler = require('express-async-handler');
const { param, body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const { getToken } = require('./verification');

const Post = require('../models/post');
const Comment = require('../models/comment');

require('dotenv').config();

module.exports.createPost = [
  // Get jwt token
  getToken,

  // Validate input
  body('title').trim().isLength({ min: 1 }).withMessage('title is required'),
  body('text').trim().isLength({ min: 1 }).withMessage('text is required'),
  body('published').isBoolean().withMessage('expecting boolean for published'),

  asyncHandler(async (req, res, next) => {
    // Check for input errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Invalid input',
        errors: errors.array(),
      });
    }

    // Verify jwt
    jwt.verify(req.token, process.env.secret, async (err, authData) => {
      if (err) {
        return res.status(403).json({
          message: "Couldn't verify token",
        });
      }

      // Get user from decoded jwt
      const user = authData.user;

      // Create and save post
      const post = new Post({
        title: req.body.title,
        text: req.body.text,
        author: user._id,
        created: new Date(),
        published: req.body.published,
      });
      await post.save();

      return res.json({
        message: 'Created post',
        post,
      });
    });
  }),
];

module.exports.getPost = [
  // Validate postid
  param('postid').isMongoId().withMessage('Invalid post id'),

  asyncHandler(async (req, res, next) => {
    // Check for input errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json({
        errors: errors.array(),
      });
    }

    // Find post with `postid`
    const post = await Post.findById(req.params.postid).populate(
      'author',
      'username first_name last_name _id'
    );

    // Return post
    return res.json({
      post,
    });
  }),
];

module.exports.getAllPosts = asyncHandler(async (req, res, next) => {
  // Find and return all posts
  const posts = await Post.find().populate(
    'author',
    'username first_name last_name _id'
  );

  return res.json({
    posts,
  });
});

module.exports.updatePost = [
  // Get jwt token
  getToken,

  // Validate input
  body('title').trim().isLength({ min: 1 }).withMessage('title is required'),
  body('text').trim().isLength({ min: 1 }).withMessage('text is required'),
  body('published').isBoolean().withMessage('expecting boolean for published'),
  param('postid').isMongoId().withMessage('Invalid post id'),

  asyncHandler(async (req, res, next) => {
    // Check for input errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({
        message: 'Invalid input',
        errors: errors.array(),
      });
    }

    // Find post with `postid`
    const post = await Post.findById(req.params.postid);
    if (!post) {
      return res.status(401).json({
        message: "Couldn't find post by given id",
      });
    }

    // Verify route is called by author of the post
    jwt.verify(req.token, process.env.secret, async (err, authData) => {
      if (err) {
        return res.status(403).json({
          message: "Couldn't verify jwt",
          errors: [err],
        });
      }

      // Verify request is coming from author
      const user = authData.user;
      if (user._id !== post.author.toString()) {
        return res.sendStatus(403);
      }

      // Update post
      const newPost = new Post({
        ...post,
        title: req.body.title,
        text: req.body.text,
        modified: new Date(),
        published: req.body.published,
        _id: req.params.postid,
      });
      await Post.findByIdAndUpdate(req.params.postid, newPost, {});

      return res.json({
        message: 'Updated post',
        post: newPost,
      });
    });
  }),
];

module.exports.deletePost = [
  // Get jwt token
  getToken,

  // Validate input
  param('postid').isMongoId().withMessage('Invalid post id'),

  asyncHandler(async (req, res, next) => {
    // Check for input errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.json({
        message: 'Invalid input',
        errors: errors.array(),
      });
    }

    // Find post with `postid`
    const post = await Post.findById(req.params.postid);
    if (!post) {
      return res.json({
        message: "Couldn't find post",
      });
    }

    // Verify route is called by author of the post
    jwt.verify(req.token, process.env.secret, async (err, authData) => {
      if (err) {
        return res.json({
          message: "Couldn't verify jwt",
          errors: [err],
        });
      }

      // Verify user is author of post
      const user = authData.user;
      if (user._id !== post.author.toString()) {
        return res.sendStatus(403);
      }

      // Delete post
      await Post.findByIdAndDelete(req.params.postid);

      // Delete comments of post
      await Comment.deleteMany({ post: req.params.postid });

      return res.json({
        message: 'Successfully removed post and related comments',
        post,
      });
    });
  }),
];
