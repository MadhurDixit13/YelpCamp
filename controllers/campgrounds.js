const Campground = require('../models/campground'); // campground module

module.exports.index = async (req,res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index',{campgrounds});
}

module.exports.create =  async (req,res,next)=>{
        const camp = new Campground(req.body.campground);
        camp.author = req.user._id;
        await camp.save();
        req.flash('success','Successfully made a new campground!'); // Flash message
        res.redirect(`/campgrounds/${camp._id}`);
}

module.exports.newForm = (req,res)=>{
    res.render('campgrounds/new');
}

module.exports.show = async (req,res,next)=>{
    const {id} = req.params;
    // const currentUser = req.user;/
    const campground = await Campground.findById(id).populate({path:'reviews',populate:{path:'author'}}).populate('author');
    if(!campground){
      req.flash('error','Cannot find the campground!'); // Flash message
      return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show',{campground});
}

module.exports.edit = async (req,res,next)=>{
    const {id} = req.params;
    const camp = await Campground.findByIdAndUpdate(id,{...req.body.campground});
    if(!camp){
      req.flash('error','Cannot find the campground!'); // Flash message
      return res.redirect('/campgrounds');
    }
    // const camp = await Campground.findByIdAndUpdate(id,{...req.body.campground});
    req.flash('success','Successfully updated the campground!'); // Flash message
    res.redirect(`/campgrounds/${camp._id}`);
  }

  module.exports.delete = async (req,res,next)=>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success','Successfully deleted the campground!'); // Flash message
    res.redirect('/campgrounds');
  }

  module.exports.editForm = async (req,res,next)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground){
      req.flash('error','Cannot find the campground!'); // Flash message
      return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit',{campground});
  }