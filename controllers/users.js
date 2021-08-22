const log4js = require('log4js');

const User = require('../models/user');

const logger = log4js.getLogger('users');
logger.level = 'info';

exports.getAuthUser = async (req, res, next) => {
  try {
    const { _id } = req.user;

    const user = await User.findById(_id).select('-following -followers -updatedAt');

    return res.json({ credentials: user });
  } catch (error) {
    logger.error(error);
    return next(error);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    return res.json(users);
  } catch (error) {
    logger.error(error);
    return next(error);
  }
};

exports.updateUserDetails = async (req, res, next) => {
  const { _id } = req.user;
  const { userId } = req.params;
  const { location, bio } = req.body;

  try {
    if (String(_id) !== String(userId)) {
      return next({ statusCode: 401, message: 'Unauthorized' });
    }

    const user = await User.findByIdAndUpdate(userId, { location, bio }, { new: true });

    logger.info(`${user.email} updated his own information`);
    return res.json(user);
  } catch (error) {
    logger.error(error);
    return next(error);
  }
};

exports.uploadImage = async (req, res, next) => {
  const { _id } = req.user;
  const filePath = req.file.filename;

  if (!filePath) {
    return next({ statusCode: 400, message: 'File path has not to be empty' });
  }

  try {
    await User.updateOne({ _id }, { profileImage: filePath });

    logger.info(`${req.user.email} uploaded a new profile photo`);
    res.end();
  } catch (error) {
    logger.error(error);
    return next(error);
  }
};

exports.followUser = async (req, res, next) => {
  if (!req.body?.id?.trim()) {
    return next({ statusCode: 400, message: 'ID has not to be empty' });
  }

  const { _id: userId } = req.user;
  const { id: targetUserId } = req.body;

  try {
    // user
    await User.findByIdAndUpdate(userId, { $push: { following: targetUserId } });
    // followed user
    await User.findByIdAndUpdate(targetUserId, { $push: { followers: userId } });

    logger.info(`${req.user.email} followed ${targetUserId} user`);
    res.end();
  } catch (error) {
    logger.error(error);
    return next(error);
  }
};

exports.unFollowUser = async (req, res, next) => {
  if (!req.body?.id?.trim()) {
    return next({ statusCode: 400, message: 'ID has not to be empty' });
  }

  const { _id: userId } = req.user;
  const { id: targetUserId } = req.body;

  try {
    // user
    await User.findByIdAndUpdate(userId, { $pull: { following: targetUserId } });
    // unfollowed user
    await User.findByIdAndUpdate(targetUserId, { $pull: { followers: userId } });

    logger.info(`${req.user.email} unfollowed ${targetUserId} user`);
    res.end();
  } catch (error) {
    logger.error(error);
    return next(error);
  }
};

exports.getAllFollowers = async (req, res, next) => {
  const { _id } = req.user;

  try {
    const users = await User.findById(_id).populate('followers');

    res.json(users);
  } catch (error) {
    logger.error(error);
    return next(error);
  }
};

exports.getAllFollowing = async (req, res, next) => {
  const { _id } = req.user;

  try {
    const users = await User.findById(_id).populate('following');

    res.json({ following: users.following });
  } catch (error) {
    logger.error(error);
    return next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  const { _id } = req.user;
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User is not found' });
    }

    if (String(_id) !== String(user._id)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await User.findByIdAndDelete(userId);

    return res.send(`User ${userId} was deleted`);
  } catch (error) {
    logger.error(error);
    return next(error);
  }
};
