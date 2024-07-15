const express = require('express'); // express module
const port = 3000; // port number
const path = require('path'); // path module is used to set the path of views directory
const mongoose = require('mongoose'); // mongoose module
const ejsMate = require('ejs-mate'); // ejs-mate module(used to set the layout of the page)
const methodOverride = require('method-override'); // method-override module(used to override the method of form(put, patch, delete))
const Campground = require('./models/campground'); // campground model
const campgroundSchema = require('./schemas'); // schema module joi
const ExpressError = require('./utils/ExpressError'); // ExpressError module
const catchAsync = require('./utils/catchAsync'); // catchAsync module

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

const validateCampground = (req,res,next)=>{
  
  const {error} = campgroundSchema.validate(req.body);
  if(error){
    const msg = error.details.map(el=>el.message).join(',')
    throw new ExpressError(msg,400)
  }else{
    next();
  }
}
// use ejs-locals for all ejs templates:
app.engine('ejs', ejsMate); // Set the layout of the page

// Home page
app.get('/', (req, res) => {
    res.render('home');
})

// Campgrounds page
app.get('/campgrounds', catchAsync(async (req,res,next)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index',{campgrounds});
}))

// Post new Campground
app.post('/campgrounds', validateCampground, catchAsync(async (req,res,next)=>{
  const camp = new Campground(req.body.campground);
  await camp.save();
  res.redirect(`/campgrounds/${camp._id}`);
}))

// Create a new campground
app.get('/campgrounds/new', (req,res)=>{
  res.render('campgrounds/new');
})

// Campground Show Page
app.get('/campgrounds/:id',catchAsync( async (req,res,next)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/show',{campground});
}))

//Put(Edit Campground)
app.put('/campgrounds/:id', validateCampground,catchAsync(async (req,res,next)=>{
  const {id} = req.params;
  const camp = await Campground.findByIdAndUpdate(id,{...req.body.campground});
  res.redirect(`/campgrounds/${camp._id}`);
}))

// Delete Campground
app.delete('/campgrounds/:id', catchAsync(async (req,res,next)=>{
  const {id} = req.params;
  await Campground.findByIdAndDelete(id);
  res.redirect('/campgrounds');
}))

// Edit Campground
app.get('/campgrounds/:id/edit', catchAsync(async (req,res,next)=>{
  const {id} = req.params;
  const campground = await Campground.findById(id);
  res.render('campgrounds/edit',{campground});
}))

app.all('*',(req,res,next)=>{
    next(new ExpressError('Page Not Found',404));
})

app.use((err,req,res,next)=>{  
    // const{statusCode = 500, message= 'Something went wrong'} = err;
    // res.status(statusCode).send(message);
    res.render('error',{err});
});

// listen to the port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});