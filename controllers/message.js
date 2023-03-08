const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Message = require("../models/Message");

exports.addMessages = asyncHandler(async (req, res, next) => {
  const senderId = req.user._id;
  const { recipientId, body } = req.body;

  const message = new Message({
    sender: senderId,
    recipient: recipientId,
    body,
  });
  await message.save();

  res.status(200).json({
    success: true,
    data: message,
  });
});

exports.getMessage = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const { recipientId } = req.query;

  console.log('this is user Id', userId)
  console.log('this is recipientId', recipientId)

  const messages = await Message.find({
    $or: [
      { sender: userId, recipient: recipientId },
      { sender: recipientId, recipient: userId },
    ],
  }).populate("sender recipient" , 'first_name last_name');
  res.status(201).json({
    success: true,
    data: messages,
  });
});
