const express = require("express");
const zod = require("zod");
const { User } = require("../db");
const JWT_SECRET = require("../config");
const jwt = require("jsonwebtoken");
const router = express.Router();

// zod schema for signup validation input
const signupSchema = zod.object({
  username: zod.string(),
  password: zod.string(),
  firstName: zod.string(),
  lastName: zod.string(),
});

// singup route
router.post("/signup", async (req, res) => {
  const body = req.body;
  const response = signupSchema.safeParse(body);
  if (!response.success) {
    return res.json({
      message: "Email already taken or Incorrect inputs",
    });
  }

  // checking if user exist
  const existingUser = await User.findOne({
    username: body.username,
  });

  if (existingUser) {
    return res.json({
      message: "Email already taken",
    });
  }

  // creating new user
  const newUser = await User.create(body);
  const token = jwt.sign(
    {
      userId: newUser._id,
    },
    JWT_SECRET
  );

  // sending response if user created successfully
  res.json({
    message: "User created successfully",
    token: token,
    user: newUser,
  });
});

// signin route
router.post("/signin", async (req, res) => {
  const body = req.body;

  const userExist = await User.findOne({ username: body.username });
  if (!userExist) {
    return res.json({
      message: "User not found",
    });
  }

  if (userExist.password !== body.password) {
    return res.json({
      message: "Incorrect password",
    });
  }

  const token = jwt.sign(
    {
      userid: userExist._id,
    },
    JWT_SECRET
  );
  return res.json({
    message: "Sign-in successful",
    token
  });
});

module.exports = router;
