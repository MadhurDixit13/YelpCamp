const {reviewSchema, campgroundSchema} = require('./schemas'); // schema module joi
const ExpressError = require('./utils/ExpressError'); // ExpressError module

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl; // add this line
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateCampground = (req,res,next)=>{
  
    const {error} = campgroundSchema.validate(req.body);
    if(error){
      const msg = error.details.map(el=>el.message).join(',')
      throw new ExpressError(msg,400)
    }else{
      next();
    }
  }

module.exports.validateReview = (req,res,next)=>{
  
    const {error} = reviewSchema.validate(req.body);
    if(error){
      const msg = error.details.map(el=>el.message).join(',')
      throw new ExpressError(msg,400)
    }else{
      next();
    }
  }