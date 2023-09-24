const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

require('dotenv').config();

module.exports.loginPost = [
  // Validate input
  body('username')
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage('username is required')
    .isAlphanumeric()
    .withMessage('username should be alphanumeric'),
  body('password').isLength({ min: 0 }).withMessage('password is required'),
  asyncHandler(async (req, res, next) => {
    // Check for input errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({
        message: 'Invalid input',
        errors: errors.array(),
      });
    }

    // Check if a user with given username exists
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.json({
        message: 'Incorrent username',
      });
    }

    // Verify password
    const password_matches = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!password_matches) {
      return res.json({
        message: 'Incorrect password',
      });
    }

    // Return jwt
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

module.exports.signupPost = [
  // Validate input
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
    // Check for input errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json({
        message: 'Invalid input',
        errors: errors.array(),
      });
    }

    // Check if user with given username exists
    const userExists = await User.findOne({ username: req.body.username });
    if (userExists) {
      return res.json({
        message: 'Username taken',
      });
    }

    // Save user to database
    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
      if (err) {
        res.json({
          message: 'Error hashing password',
        });
      }

      // Create and save user
      const user = new User({
        username: req.body.username,
        password: hashedPassword,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
      });
      await user.save();

      // Generate jwt for user
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
