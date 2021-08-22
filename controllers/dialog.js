const { ObjectId } = require('bson');
const log4js = require('log4js');

const Message = require('../models/message');
const User = require('../models/user');

const logger = log4js.getLogger('dialogs');
logger.level = 'info';

exports.getAllDialogUserslist = async (req, res, next) => {
  const { _id } = req.user;
  const usersIdList = [];
  const dialogList = [];

  try {
    const dialogUsers = await Message.find(
      {
        $or: [{ recipient: _id }, { author: _id }],
      },
      'author recipient -_id',
    );

    for (const dialogItem of dialogUsers) {
      const authorId = String(dialogItem.author);
      if (authorId !== String(_id) && !usersIdList.includes(authorId)) {
        usersIdList.push(authorId);
      }
    }

    const dialogListUsers = await User.find(
      { _id: { $in: usersIdList.map(ObjectId) } },
      '_id username profileImage',
    );

    res.send(test);
  } catch (error) {
    logger.error(error);
    return next(error);
  }
};

exports.getDialogMessages = async (req, res, next) => {
  const { _id } = req.user;
  const { recipientId } = req.params;

  try {
    const dialogMessages = await Message.find(
      {
        $or: [
          { author: _id, recipient: recipientId },
          { author: recipientId, recipient: _id },
        ],
      },
      '-__v',
    ).populate({
      path: 'author',
      select: 'username',
    });

    res.send(dialogMessages);
  } catch (error) {
    logger.error(error);
    return next(error);
  }
};
