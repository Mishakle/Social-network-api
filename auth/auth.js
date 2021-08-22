const log4js = require('log4js');
const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const { Strategy: JWTstrategy } = require('passport-jwt');
const { ExtractJwt: ExtractJWT } = require('passport-jwt');
const User = require('../models/user');

const logger = log4js.getLogger('auth');
logger.level = 'info';

passport.use(
  'signup',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        const username = req.body.username;
        const user = await User.create({ email, password, username });

        return done(null, user);
      } catch (error) {
        logger.error(error);
        done(error);
      }
    },
  ),
);

passport.use(
  'login',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });

        if (!user) {
          return done({ statusCode: 401 }, null);
        }

        const validate = await user.isValidPassword(password);

        if (!validate) {
          return done({ statusCode: 401 }, null);
        }
        logger.info(`${user.email} logged in`);
        return done(null, user);
      } catch (error) {
        logger.error(error);
        return done(error);
      }
    },
  ),
);

passport.use(
  new JWTstrategy(
    {
      secretOrKey: process.env.ACCESS_TOKEN_SECRET,
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    },
    async (token, done) => {
      try {
        return done(null, token.user);
      } catch (error) {
        return done(error);
      }
    },
  ),
);
