const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Post = require("../models/Post");

const VIEW_TIMEOUT_MS = 300000; // 5 minutes

// GET all posts
// @desc      create post
// @route     POST /api/v1/posts/
// @access    private

exports.addPost = asyncHandler(async (req, res, next) => {
  const { title, body } = req.body;

  const post = await Post.create({
    title,
    body,
    author: req.user.id,
  });

  res.status(200).json({
    success: true,
    post: {},
  });
});

exports.GetAllPosts = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc      Get single post
// @route     GET /api/v1/posts/:id
// @access    Public
exports.getPost = asyncHandler(async (req, res, next) => {
  // const post = await Post.findOneAndUpdate(
  //     { _id: req.params.id },
  //     { $inc: { views: 1 } },
  //     { new: true }
  //   );;

  // if (!post) {
  //   return next(
  //     new ErrorResponse(`Post not found with id of ${req.params.id}`, 404)
  //   );
  // }

  const post = await Post.findById(req.params.id);
  if (!post) {
    return next(
      new ErrorResponse(`Post not found with id of ${req.params.id}`, 404)
    );
  }
  const now = new Date();
  if (post.lastViewed && now - post.lastViewed < VIEW_TIMEOUT_MS) {
    console.log("View count not updated: timeout not reached");
  } else {
    await Post.findByIdAndUpdate(
      post._id,
      {
        $inc: { views: 1 },
        $set: { lastViewed: now },
      },
      { new: true }
    );
    console.log("View count updated");
  }

  res.status(200).json({ success: true, data: post });
});

// @desc      Get user timeline
// @route     GET /api/v1/posts/timeline
// @access    private
exports.getTimeline = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const followingIds = req.user.following.map((user) => user._id);

  const posts = await Post.find({
    $or: [
      { author: userId }, // Posts created by the authenticated user
      { author: { $in: followingIds } }, // Posts created by users the authenticated user follows
    ],
  });
  res.status(200).json({ success: true, data: posts });
});

