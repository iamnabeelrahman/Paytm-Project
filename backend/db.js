const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/paytm");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: True,
      trim: true,
    },
    lastName: {
      type: String,
      required: True,
      trim: true,
    },
    username: {
      type: String,
      required: True,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minLength: [6, "password must be of 6 letters"],
    },
  },
  { timestamps: true }
);

const User = new mongoose.model("User", userSchema);
module.exports = {
  User,
};
