const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

module.exports.getToken = asyncHandler(async (req, res, next) => {
  const bearerHeader = req.headers['authorization'];
  if (typeof bearerHeader !== undefined) {
    req.token = bearerHeader.split(' ')[1];
    next();
  }
  res.status(403).json({ message: 'Invalid token' });
});
