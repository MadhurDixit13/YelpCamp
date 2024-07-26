const express = require('express');
const router = express.Router({mergeParams:true}); // Create a new router
const catchAsync = require('../utils/catchAsync'); // catchAsync module
const review = require('../controllers/reviews'); // review module

const {isLoggedIn, validateReview, isReviewAuthor} = require('../middleware'); // middleware module


// Review Post
router.post('/', isLoggedIn, validateReview, catchAsync(review.createReview));
  
  // Delete Review
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(review.deleteReview));


module.exports = router; // Export the router module