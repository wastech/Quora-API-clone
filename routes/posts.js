const express = require("express");
const {
  GetAllPosts,
  getPost,
  addPost,
  getTimeline,
  upVote,
  downVote,
  //   updateCourse,
  deletePost
} = require("../controllers/post");

const Post = require("../models/Post");

const router = express.Router({ mergeParams: true });

const advancedResults = require("../middleware/advancedResults");
const { protect, authorize } = require("../middleware/auth");

router
  .route("/")
  .get(advancedResults(Post), GetAllPosts)
  .post(protect, authorize("user", "admin"), addPost);

router.route("/timeline").get(protect, authorize("user", "admin"), getTimeline);

router.route("/:id").get(getPost)
.delete(protect, authorize('user', 'admin'), deletePost);
//   .put(protect, authorize('publisher', 'admin'), updateCourse)
 

router.route("/:id/upvote").put(protect, authorize("user", "admin"), upVote);

router.route("/:id/downvote").put(protect, authorize("user", "admin"), downVote);

module.exports = router;
