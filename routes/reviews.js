const express = require('express');
const router = express.Router({mergeParams:true}); // Create a new router
const catchAsync = require('../utils/catchAsync'); // catchAsync module
const Campground = require('../models/campground'); // campground module
const Review = require('../models/review'); // review module
const {reviewSchema} = require('../schemas'); // schema module joi
const ExpressError = require('../utils/ExpressError'); // ExpressError module

const validateReview = (req,res,next)=>{
  
    const {error} = reviewSchema.validate(req.body);
    if(error){
      const msg = error.details.map(el=>el.message).join(',')
      throw new ExpressError(msg,400)
    }else{
      next();
    }
  }

// Review Post
router.post('/', validateReview, catchAsync(async (req,res,next)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success','Successfully posted a review!'); // Flash message
    res.redirect(`/campgrounds/${campground._id}`);
  }))
  
  // Delete Review
router.delete('/:reviewId', catchAsync(async (req,res,next)=>{
    const {id,reviewId} = req.params;
    await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);  
    req.flash('success','Successfully deleted a review!'); // Flash message 
    res.redirect(`/campgrounds/${id}`);
  }))


module.exports = router; // Export the router module