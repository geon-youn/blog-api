const express = require('express');

const commentController = require('../controllers/commentController');

const router = express.Router();

router.post('/create/:postid', commentController.createComment);

router.post('/create/:postid/:parentid', commentController.createReply);

router.get('/get/:postid', commentController.getComments);

router.put('/update/:commentid', commentController.updateComment);

router.delete('/delete/:commentid', commentController.deleteComment);

module.exports = router;
