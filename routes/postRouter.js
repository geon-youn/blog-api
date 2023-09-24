// Import router
const express = require('express');
const router = express.Router();

// Import controller
const postController = require('../controllers/postController');

// --- Set up routes ---

// Create post
router.post('/create', postController.createPost);

// Get post with `postid`
router.get('/get/:postid', postController.getPost);

// Get all posts
router.get('/get', postController.getAllPosts);

// Update post with `postid`
router.put('/update/:postid', postController.updatePost);

// Delete post with `postid`
router.delete('/delete/:postid', postController.deletePost);

// Export router
module.exports = router;
