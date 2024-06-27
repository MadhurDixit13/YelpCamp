const express = require('express'); // express module
const port = 3000; // port number
const path = require('path'); // path module is used to set the path of views directory
const mongoose = require('mongoose'); // mongoose module
const Campground = require('./models/campground'); // campground model

mongoose.connect('mongodb://localhost:27017/yelp-camp', {}); // Connect to the database

const db = mongoose.connection; // mongoose connection
db.on('error', console.error.bind(console, 'connection error:')); // error in connection
db.once('open', () => {
  console.log('Database connected'); // connected to the database
});

const app = express(); // express app

app.set('view engine', 'ejs'); // Set the view engine to ejs
app.set('views', path.join(__dirname, 'views')); // Set the path of views directory

// Home page
app.get('/', (req, res) => {
    res.render('home');
});

app.get('/makecampground', (req,res)=>{
    const camp = new Campground({title: 'My Backyard', description: 'Cheap camping!'});
    camp.save();
    res.send(camp);
});

// listen to the port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});