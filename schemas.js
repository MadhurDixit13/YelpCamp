const JOI = require('joi'); // joi module(used for validation)
const campgroundSchema = JOI.object({
    campground: JOI.object({
      title: JOI.string().required(),
      price: JOI.number().required().min(0),
      image: JOI.string().required(),
      location: JOI.string().required(),
      description: JOI.string().required()
    }).required()
  })

  module.exports = campgroundSchema;