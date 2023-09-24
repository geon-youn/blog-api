// Import Express
const express = require('express');
const app = express();

// Import routes
const userRouter = require('./routes/userRouter');
const postRouter = require('./routes/postRouter');
const commentRouter = require('./routes/commentRouter');

// Set up dotenv
require('dotenv').config();

// Connect to database
const mongoose = require('mongoose', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connect(process.env.mongodb);
mongoose.connection.on(
  'error',
  console.error.bind(console, 'mongo connection error')
);

// Set up json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up routes
app.use('/api/user', userRouter);
app.use('/api/post', postRouter);
app.use('/api/comment', commentRouter);

// Set up port
app.listen(3000, () => {
  console.log('listening on port 3000');
});
