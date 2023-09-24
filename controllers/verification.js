const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

// Get jwt token from authorization header and store it in req.token
module.exports.getToken = asyncHandler(async (req, res, next) => {
  const bearerHeader = req.headers['authorization'];
  if (typeof bearerHeader !== undefined) {
    req.token = bearerHeader.split(' ')[1];
    return next();
  }
  return res.status(403).json({ message: 'Invalid token' });
});
