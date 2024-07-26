const JOI = require('joi'); // joi module(used for validation)
module.exports.campgroundSchema = JOI.object({
    campground: JOI.object({
      title: JOI.string().required(),
      price: JOI.number().required().min(0),
      image: JOI.string().required(),
      location: JOI.string().required(),
      description: JOI.string().required(),
    }).required()
  })

module.exports.reviewSchema = JOI.object({
    review: JOI.object({
        rating: JOI.number().required().min(1).max(5),
        body: JOI.string().required(),
    }).required()
});
  
