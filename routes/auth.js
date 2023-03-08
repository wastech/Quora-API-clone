const express = require("express");
const {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  updateDetails,
  updatePassword,
  confirmEmail,
  follow,
  unfollow,
  following,
  followers,
} = require("../controllers/auth");

const router = express.Router();

const { protect } = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/me", protect, getMe);
router.get("/confirmemail", confirmEmail);
router.put("/updatedetails", protect, updateDetails);
router.put("/updatepassword", protect, updatePassword);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resettoken", resetPassword);

router.post("/:userId/follow", protect, follow);
router.post("/:userId/unfollow", protect, unfollow);

router.get("/:userId/followers", protect, followers);
router.get("/:userId/following", protect, following);

module.exports = router;
