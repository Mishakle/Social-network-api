const { model, Schema } = require('mongoose');

const postSchema = new Schema(
  {
    content: {
      type: String,
      trim: true,
      minLength: 1,
      maxLength: 1000,
      required: [true, 'Message body has not to be empty'],
    },
    likeCount: {
      type: Number,
      default: 0,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true },
);

postSchema.set('toJSON', {
  transform: (doc, { __v, ...rest }, options) => rest,
});

postSchema.set('toObject', {
  transform: (doc, { __v, ...rest }, options) => rest,
});

const Post = model('Post', postSchema);

module.exports = Post;
