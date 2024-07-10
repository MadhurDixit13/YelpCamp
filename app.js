const express = require('express'); // express module
const port = 3000; // port number
const path = require('path'); // path module is used to set the path of views directory
const mongoose = require('mongoose'); // mongoose module
const ejsMate = require('ejs-mate'); // ejs-mate module(used to set the layout of the page)
const methodOverride = require('method-override'); // method-override module(used to override the method of form(put, patch, delete))
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

app.use(express.urlencoded({ extended: true })); // Parse the data from the form
app.use(methodOverride('_method')); // Use the method-override module
// use ejs-locals for all ejs templates:
app.engine('ejs', ejsMate); // Set the layout of the page

// Home page
app.get('/', (req, res) => {
    res.render('home');
});

// Campgrounds page
app.get('/campgrounds', async (req,res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index',{campgrounds});
})

// Post new Campground
app.post('/campgrounds', async (req,res)=>{

  const camp = new Campground(req.body.campground);
  camp.save();
  res.redirect(`/campgrounds/${camp._id}`);
});

// Create a new campground
app.get('/campgrounds/new', (req,res)=>{
  res.render('campgrounds/new');
});

// Campground Show Page
app.get('/campgrounds/:id', async (req,res)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/show',{campground});
});

//Put(Edit Campground)
app.put('/campgrounds/:id', async (req,res)=>{
  const {id} = req.params;
  const camp = await Campground.findByIdAndUpdate(id,{...req.body.campground});
  res.redirect(`/campgrounds/${camp._id}`);
});

// Delete Campground
app.delete('/campgrounds/:id', async (req,res)=>{
  const {id} = req.params;
  await Campground.findByIdAndDelete(id);
  res.redirect('/campgrounds');
});

// Edit Campground
app.get('/campgrounds/:id/edit', async (req,res)=>{
  const {id} = req.params;
  const campground = await Campground.findById(id);
  res.render('campgrounds/edit',{campground});
});

// listen to the port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});