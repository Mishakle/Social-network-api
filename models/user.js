const { model, Schema } = require('mongoose');
const bcrypt = require('bcrypt');
const fieldsValidator = require('validator');

const userSchema = new Schema(
  {
    email: {
      type: String,
      trim: true,
      unique: true,
      lowercase: true,
      required: [true, 'Email has not to be empty'],
      validate: {
        validator: (email) => fieldsValidator.isEmail(email),
        message: (props) => `${props.value}`,
      },
    },
    password: {
      type: String,
      minLength: 6,
      required: [true, 'Password has not to be empty'],
    },
    username: {
      type: String,
      unique: true,
      required: [true, 'Username has not to be empty'],
    },
    profileImage: {
      type: String,
      default: 'default-profile.png',
    },
    location: String,
    bio: String,
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true },
);

userSchema.pre('save', async function (next) {
  const hash = await bcrypt.hash(this.password, Number(process.env.SALT_ROUNDS));
  this.password = hash;
  next();
});

userSchema.methods.isValidPassword = async function (password) {
  const compare = await bcrypt.compare(password, this.password);

  return compare;
};

userSchema.set('toJSON', {
  transform: (doc, { __v, password, ...rest }, options) => rest,
});

userSchema.set('toObject', {
  transform: (doc, { __v, password, ...rest }, options) => rest,
});

const User = model('User', userSchema);

module.exports = User;
