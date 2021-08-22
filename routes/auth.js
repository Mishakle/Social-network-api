const express = require('express');
const passport = require('passport');

const router = express.Router();

const { signUp, login } = require('../controllers/auth');

router.post(
  '/signup',
  passport.authenticate('signup', { session: false }),
  async (req, res, next) => {
    res.end();
  },
);

router.post('/login', login);

module.exports = router;
