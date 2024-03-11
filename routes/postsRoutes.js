const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authController = require('../controllers/authController');

router.get('/new', authController.protect, postController.getNewPost);
router.get('/id/:id', postController.getPost);

router.post('/store', authController.protect, postController.createPost);

module.exports = router;

