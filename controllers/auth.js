const passport = require('passport');
const { jwtCreator } = require('../utils/jwtCreator');

exports.login = async (req, res, next) => {
  passport.authenticate('login', async (err, user, info) => {
    try {
      if (err) {
        return next(err);
      }
      req.login(user, { session: false }, async (error) => {
        if (error) {
          return next(error);
        }

        const { _id, email } = user;
        const body = { _id, email };
        const token = jwtCreator(body);

        return res.json({ token });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
};
