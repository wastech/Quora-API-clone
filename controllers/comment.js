const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Comment = require("../models/Comment");

exports.addComment = asyncHandler(async (req, res, next) => {
  const { text, post } = req.body;

  const comment = new Comment({
    user: req.user._id,
    text: text,
    post: post,
  });
  await comment.save();

  res.status(200).json({
    success: true,
    data: comment,
  });
});

exports.getComments = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;

  const { limit = 10, page = 1 } = req.query;
  const skip = (page - 1) * limit;

  const comments = await Comment.find({ post: postId })
    .populate("user", "_id name")
    .sort("-createdAt")
    .skip(skip)
    .limit(parseInt(limit));

  res.status(200).json({
    success: true,
    data: comments,
  });
});

// @desc      Update Comment
// @route     PUT /api/v1/messages/:id
// @access    Private/Admin
exports.updateComment = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findByIdAndUpdate(
    req.params.commentId,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  console.log("this is comment", comment);

  res.status(200).json({
    success: true,
    data: comment,
  });
});

// @desc      Delete Post
// @route     DELETE /api/v1/posts/:id
// @access    Private
exports.deleteComment = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findById(req.params.commentId);

  if (!comment) {
    return next(
      new ErrorResponse(`No post with the id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is post owner
  if (comment.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete post ${comment._id}`,
        401
      )
    );
  }

  await comment.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});
