const express = require("express");
const {
  addComment,
  getComments,
  updateComment,
  deleteComment,
} = require("../controllers/comment");

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require("../middleware/auth");

router.route("/").post(protect, authorize("user", "admin"), addComment);

router.route("/:postId").get(protect, authorize("user", "admin"), getComments);
router
  .route("/:commentId")
  .put(protect, authorize("user", "admin"), updateComment);
router
  .route("/:commentId")
  .delete(protect, authorize("user", "admin"), deleteComment);

module.exports = router;
``;
