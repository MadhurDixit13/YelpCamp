const mongoose = require('mongoose'); // mongoose module
const Schema = mongoose.Schema; // mongoose schema
const Review = require('./review'); // review module
const { campgroundSchema } = require('../schemas');
const opts = { toJSON: { virtuals: true } }; // Options for the virtuals

const ImageSchema = new Schema({
    url: String,
    filename: String
});
ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload','/upload/w_200');
})

const CampgroundSchema = new Schema({
    title: String,
    price: Number,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    description: String,
    location: String,
    images: [
        ImageSchema
    ],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews : [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts); // Create a new campground schema

CampgroundSchema.virtual('properties.popUpMarkup').get(function(){
    return `<strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
    <p>${this.description.substring(0,20)}...</p>`;
}); // Virtual for the popup markup

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