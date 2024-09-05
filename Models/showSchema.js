const mongoose = require("mongoose");

const showSchema = new mongoose.Schema({
  showName: {
    type: String,
    required: true,
  },
  showStart: {
    type: String,
    required: true,
  },
  vendorId: {
    type: String,
    required: true,
  },
  movieId: {
    type: String,
    required: true,
  },
  theaterId: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    require: true,
    default: 0,
  },
});

module.exports = mongoose.model("showSchema", showSchema);
module.exports.showSchema;
