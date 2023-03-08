const express = require('express');
const {
    addMessages,
    getMessage,
 
} = require('../controllers/message');

const Message = require('../models/Message');

const router = express.Router({ mergeParams: true });

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('admin', 'user'));

router
  .route('/')
  .get(advancedResults(Message), getMessage)
  .post(addMessages);


module.exports = router;