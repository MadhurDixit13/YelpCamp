const mongoose = require('mongoose'); // mongoose module
const Campground = require('../models/campground'); // campground model
const descriptors = require('./seedHelpers').descriptors; // descriptors
const places = require('./seedHelpers').places; // places
const cities = require('./cities'); // cities

mongoose.connect('mongodb://localhost:27017/yelp-camp', {}); // Connect to the database

const db = mongoose.connection; // mongoose connection
db.on('error', console.error.bind(console, 'connection error:')); // error in connection
db.once('open', () => {
  console.log('Database connected'); // connected to the database
});

// Seed the database
const seedDB = async () => {
    await Campground.deleteMany({}); // Delete all the campgrounds
    for(let i = 0; i < 50; i++){
        const random1000 = Math.floor(Math.random() * 1000); // Random number between 0 and 1000
        const camp = new Campground({
            title: `${descriptors[random1000 % descriptors.length]} ${places[random1000 % places.length]}`, // Title of the campground
            price: Math.floor(Math.random() * 20) + 10, // Price of the campground
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod, nemo.', // Description of the campground
            location: `${cities[random1000].city}, ${cities[random1000].state}` // Location of the campground
        });
        await camp.save(); // Save the campground
    }
};

seedDB().then(() => {
    mongoose.connection.close(); // Close the connection    
});