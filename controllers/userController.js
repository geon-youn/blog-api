const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

module.exports.loginPost = [
  body('username')
    .trim()
    .escape()
    .isLength({ min: 0 })
    .withMessage('username is required')
    .isAlphanumeric()
    .withMessage('username should be alphanumeric'),
  body('password').isLength({ min: 0 }).withMessage('password is required'),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req.body);

    if (errors) {
      res.json()
    } 

    else {
      res.json()
    }
  }),
];
