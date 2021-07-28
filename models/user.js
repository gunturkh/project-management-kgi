const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
  },
  role: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    // required: true,
  },
  position: {
    type: String,
    // required: true,
  },
  avatar: {
    type: String,
  },
});

module.exports = mongoose.model("user", userSchema);
