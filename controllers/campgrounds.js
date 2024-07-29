const Campground = require('../models/campground'); // campground module
const {cloudinary} = require('../cloudinary/index.js'); // cloudinary module
const maptilerClient = require("@maptiler/client");
const fetch = require('node-fetch-cjs');
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;
// maptilerClient.config.fetch = fetch;



module.exports.index = async (req,res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index',{campgrounds});
}

module.exports.create =  async (req,res,next)=>{
        const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 });
        const camp = new Campground(req.body.campground);
        camp.geometry = geoData.features[0].geometry;
        console.log(camp);
        camp.images = req.files.map(f => ({url: f.path, filename: f.filename}));
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
    console.log(campground);
    if(!campground){
      req.flash('error','Cannot find the campground!'); // Flash message
      return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show',{campground});
}

module.exports.edit = async (req,res,next)=>{
    const {id} = req.params;
    const camp = await Campground.findByIdAndUpdate(id,{...req.body.campground});
    const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 });
    if(!camp){
      req.flash('error','Cannot find the campground!'); // Flash message
      return res.redirect('/campgrounds');
    }
    camp.geometry = geoData.features[0].geometry;
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
    camp.images.push(...imgs);
    await camp.save();
    if(req.body.deleteImages){
      for(let filename of req.body.deleteImages){
        await cloudinary.uploader.destroy(filename);
      }
      await camp.updateOne({$pull:{images:{filename:{$in:req.body.deleteImages}}}});
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