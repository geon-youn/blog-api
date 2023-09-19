const express = require('express');

const app = express();

const userRouter = require('./routes/userRouter');
const postRouter = require('./routes/postRouter');
const commentRouter = require('./routes/commentRouter');
const blogRouter = require('./routes/blogRouter');

require('dotenv').config();

const mongoose = require('mongoose', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connect(process.env.mongodb);
mongoose.connection.on(
  'error',
  console.error.bind(console, 'mongo connection error')
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/user', userRouter);
app.use('/api/post', postRouter);
app.use('/api/comment', commentRouter);
app.use('/api/blog', blogRouter);

app.listen(3000, () => {
  console.log('listening on port 3000');
});
