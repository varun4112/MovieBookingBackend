const mongoose = require("mongoose");

const theaterSchema = new mongoose.Schema({
  userId: {
    type: String,
    default: "",
    required: "true",
  },
  name: {
    type: String,
    default: "",
    required: "true",
  },
  address: {
    type: String,
    default: "",
    required: "true",
  },
  phone: {
    type: String,
    default: "",
    required: "true",
  },
  email: {
    type: String,
    default: "",
    required: "true",
  },
});

module.exports = mongoose.model("theaterSchema", theaterSchema);
module.exports.theaterSchema;
