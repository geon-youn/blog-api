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

module.exports.getPost = asyncHandler();
module.exports.updatePost = asyncHandler();
module.exports.deletePost = asyncHandler();
