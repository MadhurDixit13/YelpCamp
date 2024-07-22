const express = require('express');
const router = express.Router(); // Create a new router
const catchAsync = require('../utils/catchAsync'); // catchAsync module
const Campground = require('../models/campground'); // campground module
const ExpressError = require('../utils/ExpressError'); // ExpressError module
const {campgroundSchema} = require('../schemas'); // schema module joi

const validateCampground = (req,res,next)=>{
  
    const {error} = campgroundSchema.validate(req.body);
    if(error){
      const msg = error.details.map(el=>el.message).join(',')
      throw new ExpressError(msg,400)
    }else{
      next();
    }
  }

// Campgrounds page
router.get('/', catchAsync(async (req,res,next)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index',{campgrounds});
}))

// Post new Campground
router.post('/', validateCampground, catchAsync(async (req,res,next)=>{
  const camp = new Campground(req.body.campground);
  await camp.save();
  req.flash('success','Successfully made a new campground!'); // Flash message
  res.redirect(`/campgrounds/${camp._id}`);
}))

// Create a new campground
router.get('/new', (req,res)=>{
  res.render('campgrounds/new');
})

// Campground Show Page
router.get('/:id',catchAsync( async (req,res,next)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id).populate('reviews');;
    if(!campground){
      req.flash('error','Cannot find the campground!'); // Flash message
      return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show',{campground});
}))

//Put(Edit Campground)
router.put('/:id', validateCampground,catchAsync(async (req,res,next)=>{
  const {id} = req.params;
  const camp = await Campground.findByIdAndUpdate(id,{...req.body.campground});
  if(!camp){
    req.flash('error','Cannot find the campground!'); // Flash message
    return res.redirect('/campgrounds');
  }
  req.flash('success','Successfully updated the campground!'); // Flash message
  res.redirect(`/campgrounds/${camp._id}`);
}))

// Delete Campground
router.delete('/:id', catchAsync(async (req,res,next)=>{
  const {id} = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash('success','Successfully deleted the campground!'); // Flash message
  res.redirect('/campgrounds');
}))

// Edit Campground
router.get('/:id/edit', catchAsync(async (req,res,next)=>{
  const {id} = req.params;
  const campground = await Campground.findById(id);
  res.render('campgrounds/edit',{campground});
}))

module.exports = router; // Export the router module