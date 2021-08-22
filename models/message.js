const { model, Schema } = require('mongoose');

const messageSchema = new Schema(
  {
    text: {
      type: String,
      trim: true,
      minLength: 1,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    recipient: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const Message = model('Message', messageSchema);

module.exports = Message;
