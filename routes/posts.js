const express = require('express');

const {
  createPost,
  getAllPosts,
  updatePost,
  deletePost,
  getAllAuthUserPosts,
} = require('../controllers/posts');

const router = express.Router();

// create post
router.post('/posts', createPost);

// get all posts
router.get('/posts', getAllPosts);

// get own user posts
router.get('/user/posts', getAllAuthUserPosts);

// change post
router.put('/posts/:postId', updatePost);

// delete post
router.delete('/posts/:postId', deletePost);

module.exports = router;
