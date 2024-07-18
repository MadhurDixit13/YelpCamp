const mongoose = require('mongoose'); // mongoose module
const Schema = mongoose.Schema; // mongoose schema

const ReviewSchema= new Schema({
    body:String,
    rating:Number
})

module.exports = mongoose.model('Review', ReviewSchema); // Export the model of the campground schema