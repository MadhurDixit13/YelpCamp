const Review = require('../models/review'); // review module
const Campground = require('../models/campground'); // campground module

module.exports.createReview = async (req,res,next)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success','Successfully posted a review!'); // Flash message
    res.redirect(`/campgrounds/${campground._id}`);
  }

module.exports.deleteReview = async (req,res,next)=>{
    const {id,reviewId} = req.params;
    await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);  
    req.flash('success','Successfully deleted a review!'); // Flash message 
    res.redirect(`/campgrounds/${id}`);
  }
