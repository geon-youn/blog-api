const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const { getToken } = require('./verification');

const Post = require('../models/post');

require('dotenv').config();

module.exports.createPost = [
  getToken,
  body('title').trim().isLength({ min: 1 }).withMessage('title is required'),
  body('text').trim().isLength({ min: 1 }).withMessage('text is required'),
  body('published').isBoolean().withMessage('expecting boolean for published'),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Invalid input',
        errors: errors.array(),
      });
    }

    jwt.verify(req.token, process.env.secret, async (err, authData) => {
      if (err) {
        return res.status(403).json({
          message: "Couldn't verify token",
        });
      }

      const user = authData.user;

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
      });
    });
  }),
];

module.exports.getPost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id).populate(
    'author',
    'username first_name last_name _id'
  );

  return res.json({
    post,
  });
});

module.exports.updatePost = [
  getToken,
  body('title').trim().isLength({ min: 1 }).withMessage('title is required'),
  body('text').trim().isLength({ min: 1 }).withMessage('text is required'),
  body('published').isBoolean().withMessage('expecting boolean for published'),
  asyncHandler(async (req, res, next) => {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(401).json({
        message: "Couldn't find post by given id",
      });
    }

    jwt.verify(req.token, process.env.secret, async (err, authData) => {
      if (err) {
        return res.status(403).json({
          message: "Couldn't verify jwt",
          errors: [err],
        });
      }
      const user = authData.user;

      // Verify request is coming from author
      if (user._id !== post.author.toString()) {
        return res.sendStatus(403);
      }

      // Check for errors
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.json({
          message: 'Invalid input',
          errors: errors.array(),
        });
      }

      // Update post
      const newPost = new Post({
        ...post,
        title: req.body.title,
        text: req.body.text,
        modified: new Date(),
        published: req.body.published,
        _id: req.params.id,
      });

      await Post.findByIdAndUpdate(req.params.id, newPost, {});
      return res.json({
        message: 'Updated post',
        post: newPost,
      });
    });
  }),
];

module.exports.deletePost = [
  getToken,
  asyncHandler(async (req, res, next) => {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.json({
        message: "Couldn't find post",
      });
    }

    jwt.verify(req.token, process.env.secret, async (err, authData) => {
      if (err) {
        return res.json({
          message: "Couldn't verify jwt",
          errors: [err],
        });
      }

      const user = authData.user;

      if (user._id !== post.author.toString()) {
        return res.sendStatus(403);
      }

      await Post.findByIdAndDelete(req.params.id);
      return res.json({
        message: 'Successfully removed post',
        post,
      });
    });
  }),
];
