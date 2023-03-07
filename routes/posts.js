const express = require("express");
const {
  GetAllPosts,
  getPost,
  addPost,
  getTimeline,
  sharePost,
  //   updateCourse,
  //   deleteCourse
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

router.route("/:id").get(getPost);
//   .put(protect, authorize('publisher', 'admin'), updateCourse)
//   .delete(protect, authorize('publisher', 'admin'), deleteCourse);

module.exports = router;