const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Post = require("../models/Post");
const User = require("../models/User");

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

exports.upVote = async (req, res, next) => {
  try {
    const question = await Post.findById(req.params.id);
    if (!question) {
      return next(
        new ErrorResponse(`Post not found with id of ${req.params.id}`, 404)
      );
    }
    const user = await User.findById(req.user._id);
    // Check if the user has already upvoted the question
    if (question.upvotes.includes(user._id)) {
      return res
        .status(400)
        .json({ message: "You have already upvoted this question" });
    }

    // Check if the user has already downvoted the question
    if (question.downvotes.includes(user._id)) {
      question.downvotes.pull(user._id);
    }

    question.upvotes.push(user._id);
    await question.save();
    res.status(200).json({ message: "Question upvoted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};


exports.downVote = asyncHandler(async (req, res, next) => {
  try {
    const question = await Post.findById(req.params.id);
    if (!question) {
      return next(
        new ErrorResponse(`Post not found with id of ${req.params.id}`, 404)
      );
    }
    const user = await User.findById(req.user._id);
    // Check if the user has already downvotes the question
    if (question.downvotes.includes(user._id)) {
      return res
        .status(400)
        .json({ message: "You have already downvotes this question" });
    }

    // Check if the user has already upvotes the question
    if (question.upvotes.includes(user._id)) {
      question.upvotes.pull(user._id);
    }

    question.downvotes.push(user._id);
    await question.save();
    res.status(200).json({ message: "Question downvotes successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});


// @desc      Delete Post
// @route     DELETE /api/v1/posts/:id
// @access    Private
exports.deletePost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  console.log('this is post', post)

  if (!post) {
    return next(
      new ErrorResponse(`No post with the id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is post owner
  if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete post ${post._id}`,
        401
      )
    );
  }

  await post.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});