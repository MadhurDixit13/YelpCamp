if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express'); // express module
const port = 3000; // port number
const path = require('path'); // path module is used to set the path of views directory
const mongoose = require('mongoose'); // mongoose module
const ejsMate = require('ejs-mate'); // ejs-mate module(used to set the layout of the page)
const session = require('express-session'); // express-session module
const MongoStore = require('connect-mongo')(session); // connect-mongo module(used to store the session in the database)
const flash = require('connect-flash'); // connect-flash module(used to show the flash messages)
const methodOverride = require('method-override'); // method-override module(used to override the method of form(put, patch, delete))
const ExpressError = require('./utils/ExpressError'); // ExpressError module
const campgrounds = require('./routes/campgrounds'); // campgrounds route
const reviews = require('./routes/reviews'); // reviews route
const users = require('./routes/users'); // users route
const passport = require('passport'); // passport module
const LocalStrategy = require('passport-local'); // passport-local module
const User = require('./models/user'); // user module
const multer = require('multer'); // multer module
const { storage, cloudinary } = require('./cloudinary/index.js'); // cloudinary module
const upload = multer({ storage }); // multer storage
const mongoSanitize = require('express-mongo-sanitize'); // express-mongo-sanitize module
const helmet = require('helmet'); // helmet module
const db_url = process.env.MONGODB_URL|| 'mongodb://localhost:27017/yelp-camp'; // database url

mongoose.connect(db_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}); // Connect to the database

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
app.use(mongoSanitize()); // Use the express-mongo-sanitize module

const secret = process.env.SECRET || 'thisshouldbeabettersecret!';
const store = new MongoStore({ // Store the session in the database
    url: db_url,
    secret,
    touchAfter: 24 * 3600
});
const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // session: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}


app.use(session(sessionConfig)); // Use the session module
app.use(flash()); // Use the flash module
app.use(helmet()); // Use the helmet module
const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com/",
  // "https://api.tiles.mapbox.com/",
  // "https://api.mapbox.com/",
  "https://kit.fontawesome.com/",
  "https://cdnjs.cloudflare.com/",
  "https://cdn.jsdelivr.net",
  "https://cdn.maptiler.com/", // add this
];
const styleSrcUrls = [
  "https://kit-free.fontawesome.com/",
  "https://stackpath.bootstrapcdn.com/",
  // "https://api.mapbox.com/",
  // "https://api.tiles.mapbox.com/",
  "https://fonts.googleapis.com/",
  "https://use.fontawesome.com/",
  "https://cdn.jsdelivr.net",
  "https://cdn.maptiler.com/", // add this
];
const connectSrcUrls = [
  // "https://api.mapbox.com/",
  // "https://a.tiles.mapbox.com/",
  // "https://b.tiles.mapbox.com/",
  // "https://events.mapbox.com/",
  "https://api.maptiler.com/", // add this
];

const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            childSrc: ["blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dilvwd6d9/",  
                "https://images.unsplash.com",
                "https://api.maptiler.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

app.use(passport.initialize()); // Use the passport module
app.use(passport.session()); // Use the passport module
passport.use(new LocalStrategy(User.authenticate())); // Use the LocalStrategy module
passport.serializeUser(User.serializeUser()); // Serialize the user
passport.deserializeUser(User.deserializeUser()); // Deserialize the user


app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

// use ejs-locals for all ejs templates:
app.engine('ejs', ejsMate); // Set the layout of the page

app.use('/',users); // Use the users route`
app.use('/campgrounds',campgrounds); // Use the campgrounds route
app.use('/campgrounds/:id/reviews',reviews); // Use the reviews route




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