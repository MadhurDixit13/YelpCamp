const mongoose = require('mongoose'); // mongoose module
const Schema = mongoose.Schema; // mongoose schema

const CampgroundSchema = new Schema({
    title: String,
    price: String,
    description: String,
    location: String
}); // Create a new campground schema

module.exports = mongoose.model('Campground', CampgroundSchema); // Export the model of the campground schema