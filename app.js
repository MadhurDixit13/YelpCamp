const express = require('express'); // express module
const port = 3000; // port number
const path = require('path'); // path module is used to set the path of views directory
const mongoose = require('mongoose'); // mongoose module
const ejsMate = require('ejs-mate'); // ejs-mate module(used to set the layout of the page)
const session = require('express-session'); // express-session module
const flash = require('connect-flash'); // connect-flash module(used to show the flash messages)
const methodOverride = require('method-override'); // method-override module(used to override the method of form(put, patch, delete))
const ExpressError = require('./utils/ExpressError'); // ExpressError module
const campgrounds = require('./routes/campgrounds'); // campgrounds route
const reviews = require('./routes/reviews'); // reviews route
const passport = require('passport'); // passport module
const LocalStrategy = require('passport-local'); // passport-local module
const User = require('./models/user'); // user module

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
app.use(express.static(path.join(__dirname, 'views'))); // Set the path of public directory
app.use(express.static(path.join(__dirname, 'public'))); // Set the path of public directory


const sessionConfig = {
    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig)); // Use the session module
app.use(flash()); // Use the flash module
app.use(passport.initialize()); // Use the passport module
app.use(passport.session()); // Use the passport module
passport.use(new LocalStrategy(User.authenticate())); // Use the LocalStrategy module
passport.serializeUser(User.serializeUser()); // Serialize the user
passport.deserializeUser(User.deserializeUser()); // Deserialize the user


app.use((req,res,next)=>{
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

// use ejs-locals for all ejs templates:
app.engine('ejs', ejsMate); // Set the layout of the page

const isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash('error','You must be signed in first!'); // Flash message
        return res.redirect('/login');
    }
    next();
}

app.use('/campgrounds',campgrounds); // Use the campgrounds route
app.use('/campgrounds/:id/reviews',reviews); // Use the reviews route
app.use('/users',require('./routes/users')); // Use the users route`



// Home page
app.get('/', (req, res) => {
    res.render('home');
})

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