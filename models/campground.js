const mongoose = require('mongoose'); // mongoose module
const Schema = mongoose.Schema; // mongoose schema
const Review = require('./review'); // review module
const { campgroundSchema } = require('../schemas');

const CampgroundSchema = new Schema({
    title: String,
    price: Number,
    description: String,
    location: String,
    image: String,
    reviews : [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}); // Create a new campground schema

CampgroundSchema.post('findOneAndDelete', async function(doc){
    if(doc){
        await Review.deleteMany({
            _id:{
                $in: doc.reviews
            }
        })
    }
}) // Middleware to delete reviews associated with the campground

module.exports = mongoose.model('Campground', CampgroundSchema); // Export the model of the campground schema