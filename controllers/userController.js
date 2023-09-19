const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

require('dotenv').config();

module.exports.loginPost = [
  body('username')
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage('username is required')
    .isAlphanumeric()
    .withMessage('username should be alphanumeric'),
  body('password').isLength({ min: 0 }).withMessage('password is required'),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    // Send error message if input is invalid
    if (!errors.isEmpty()) {
      return res.json({
        message: 'Invalid input',
        errors: errors.array(),
      });
    }

    // Check if user exists
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.json({
        message: 'User with username does not exist',
      });
    }

    // Check password
    const password_matches = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!password_matches) {
      return res.json({
        message: 'Incorrect password',
      });
    }

    // Give user their JWT
    jwt.sign({ user }, process.env.secret, (err, token) => {
      if (err) {
        return res.json({
          message: 'Error generating jwt',
        });
      }
      return res.json({
        message: 'Logged in as ' + user.username,
        token,
      });
    });
  }),
];

// User signs up
module.exports.signupPost = [
  // Validate and sanitize input
  body('username')
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage('username is required')
    .isAlphanumeric()
    .withMessage('username should be alphanumeric'),
  body('password').isLength({ min: 1 }).withMessage('password is required'),
  body('first_name')
    .trim()
    .isLength({ min: 1 })
    .withMessage('first name is required')
    .isAlpha()
    .withMessage('first name should be alphabetic'),
  body('last_name')
    .trim()
    .isLength({ min: 1 })
    .withMessage('last name is required')
    .isAlpha()
    .withMessage('last name should be alphabetic'),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    // Send error message if input is invalid
    if (!errors.isEmpty()) {
      return res.json({
        message: 'Invalid input',
        errors: errors.array(),
      });
    }

    // Check if username exists
    const userExists = await User.findOne({ username: req.body.username });
    if (userExists) {
      return res.json({
        message: 'User with username already exists',
      });
    }

    // Save user to database
    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
      if (err) {
        res.json({
          message: 'Error hashing password',
        });
      }
      const user = new User({
        username: req.body.username,
        password: hashedPassword,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
      });

      await user.save();
      jwt.sign({ user }, process.env.secret, async (err, token) => {
        if (err) {
          return res.json({
            message: "Couldn't generate token",
          });
        }
        return res.json({
          message: 'Created user sucessfully.',
          token,
        });
      });
    });
  }),
];
