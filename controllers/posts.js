const log4js = require('log4js');

const Post = require('../models/post');
const User = require('../models/user');

const logger = log4js.getLogger('posts');
logger.level = 'info';

exports.createPost = async (req, res, next) => {
  if (!req.body?.content?.trim()) {
    return next({ statusCode: 400, message: 'Content has not to be empty' });
  }

  const { _id } = req.user;
  const { content } = req.body;

  try {
    const user = await User.findById(_id);

    if (!user) {
      return next({ statusCode: 404, message: 'User is not found' });
    }

    const post = await Post.create({ content, user: _id });

    logger.info(`${user.email} created a post`);
    return res.json(post);
  } catch (error) {
    logger.error(error);
    return next(error);
  }
};

exports.getAllAuthUserPosts = async (req, res, next) => {
  const { _id } = req.user;

  try {
    const posts = await Post.find({ user: _id }).sort('-_id').populate({
      path: 'user',
      select: 'profileImage',
    });

    res.json({ posts });
  } catch (error) {
    logger.error(error);
    return next(error);
  }
};

exports.getAllPosts = async (req, res, next) => {
  try {
    const postsData = await Post.find().sort('-_id').populate({
      path: 'user',
      select: 'profileImage',
    });

    return res.json(postsData);
  } catch (error) {
    logger.error(error);
    return next(error);
  }
};

exports.updatePost = async (req, res, next) => {
  if (!req.body?.content?.trim()) {
    return next({ statusCode: 400, message: 'Content has not to be empty' });
  }

  const { _id } = req.user;
  const { postId } = req.params;
  const { content } = req.body;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      return next({ statusCode: 404, message: 'Post is not found' });
    }
    if (String(_id) !== String(post.user._id)) {
      return next({ statusCode: 401, message: 'Unauthorized' });
    }

    const updatedPost = await Post.findByIdAndUpdate(postId, { content }, { new: true });

    logger.info(`${req.user.email} updated ${postId} post`);
    return res.json(updatedPost);
  } catch (error) {
    logger.error(error);
    return next(error);
  }
};

exports.deletePost = async (req, res, next) => {
  const { _id } = req.user;
  const { postId } = req.params;

  try {
    const postUser = await Post.findById(postId);

    if (!postUser) {
      return next({ statusCode: 404, message: 'User is not found' });
    }
    if (String(_id) !== String(postUser.user._id)) {
      return next({ statusCode: 401, message: 'Unauthorized' });
    }

    await Post.findByIdAndDelete(postId);

    logger.info(`${req.user.email} deleted ${postId} post`);
    return res.send(`Post ${postId} was deleted`);
  } catch (error) {
    logger.error(error);
    return next(error);
  }
};
