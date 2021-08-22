const express = require('express');

const {
  getAuthUser,
  getAllUsers,
  uploadImage,
  updateUserDetails,
  deleteUser,
  followUser,
  unFollowUser,
  getAllFollowers,
  getAllFollowing,
} = require('../controllers/users');

const { upload } = require('../utils/multer');

const router = express.Router();

// get own user data
router.get('/user', getAuthUser);

// get all users
router.get('/users', getAllUsers);

// add profile photo
router.post('/user/image', upload.single('profileImage'), uploadImage);

// update user information
router.put('/user/:userId', updateUserDetails);

// get all followers
router.get('/followers', getAllFollowers);

// get all following
router.get('/following', getAllFollowing);

// follow user
router.post('/follow', followUser);

// unfollow user
router.post('/unfollow', unFollowUser);

// delete user
router.delete('/user/:userId', deleteUser);

module.exports = router;
