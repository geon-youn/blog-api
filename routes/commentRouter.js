// Import router
const express = require('express');
const router = express.Router();

// Import controller
const commentController = require('../controllers/commentController');

// --- Set up routes ---

// Create comment to a post with `postid`
router.post('/create/:postid', commentController.createComment);

// Reply to a comment with `parentid` to a post with `postid`
router.post('/create/:postid/:parentid', commentController.createReply);

// Get all comments to a post with `postid`
router.get('/get/:postid', commentController.getComments);

// Update comment with `commentid`
router.put('/update/:commentid', commentController.updateComment);

// Delete comment with `commentid`
router.delete('/delete/:commentid', commentController.deleteComment);

// Export router
module.exports = router;
