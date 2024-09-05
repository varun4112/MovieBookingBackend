const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  vendorId:{
    type: String,
    required: true,
    default: "",
  },
  name: {
    type: String,
    required: true,
    default: "",
  },
  desc: {
    type: String,
    required: true,
    default: "",
  },
  duration: {
    type: String,
    required: true,
    default: 0,
  },
  rating: {
    type: String,
    required: true,
    default: "",
  },
  genre: {
    type: String,
    required: true,
    default: "",
  },
  poster: {
    type: String,
    require: false,
  },
});

module.exports = mongoose.model("movieSchema", movieSchema);
module.exports.movieSchema;
