const express = require('express');

const router = express.Router();
const postController = require('../controllers/postController');

router.post('/create', postController.createPost);
router.get('/get/:postid', postController.getPost);
router.get('/get', postController.getAllPosts);
router.put('/update/:postid', postController.updatePost);
router.delete('/delete/:postid', postController.deletePost);

module.exports = router;
