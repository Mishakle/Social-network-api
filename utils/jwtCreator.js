const jwt = require('jsonwebtoken');

exports.jwtCreator = (body) => {
  return jwt.sign({ user: body }, process.env.ACCESS_TOKEN_SECRET, {
    algorithm: process.env.ALGORITHM,
    expiresIn: process.env.EXPRIRES_IN,
  });
};
