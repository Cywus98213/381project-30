const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Name is required"],
  },
  password: {
    type: String,
    required: [true, "password is required"],
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
