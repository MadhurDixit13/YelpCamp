const express = require('express');
const router = express.Router(); // Create a new router
const catchAsync = require('../utils/catchAsync'); // catchAsync module
const Campground = require('../models/campground'); // campground module
const ExpressError = require('../utils/ExpressError'); // ExpressError module
const {campgroundSchema} = require('../schemas'); // schema module joi
const {isLoggedIn, validateCampground, isAuthor} = require('../middleware'); // middleware module
const campground = require('../controllers/campgrounds'); // controller module
const multer = require('multer'); // multer module
const { storage, cloudinary } = require('../cloudinary/index.js'); // cloudinary module
const upload = multer({ storage }); // multer storage

router.route('/')
    .get(catchAsync(campground.index)) // Campgrounds page
    .post(isLoggedIn, upload.array('campground[image]'), validateCampground, catchAsync(campground.create)) // Post new Campground

// Create a new campground
router.get('/new', isLoggedIn, campground.newForm)

router.route('/:id')
    .get(catchAsync(campground.show)) // Campground Show Page
    .put(isLoggedIn, isAuthor, upload.array('campground[image]'), validateCampground, catchAsync(campground.edit)) // Edit Campground
    .delete(isLoggedIn, isAuthor, catchAsync(campground.delete)) // Delete Campground

// Edit Campground
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campground.editForm))

module.exports = router; // Export the router module