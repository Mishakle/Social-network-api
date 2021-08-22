const express = require('express');
const router = express.Router();

const { getAllDialogUserslist, getDialogMessages } = require('../controllers/dialog');

router.get('/dialoglist', getAllDialogUserslist);

router.get('/messages/:recipientId', getDialogMessages);

module.exports = router;
