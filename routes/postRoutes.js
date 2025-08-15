const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const upload = require('../middlewares/uploadPost'); // multer config
const auth = require('../middlewares/auth'); // JWT auth

// Create post
router.post('/post', auth, upload.single('picture'), postController.createPost);
router.get('/posts', auth, postController.getPosts);

module.exports = router;
