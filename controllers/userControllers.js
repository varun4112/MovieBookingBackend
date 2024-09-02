const express = require("express");
const users = require("../Models/userSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

//Function to handle user registration
exports.register = async (req, res) => {
  const { userName, name, email, password, phone, aadhaarNumber } = req.body;
  const salt = await bcrypt.genSalt(10);
  // hashing password and aadhaar number
  const hashedPassword = await bcrypt.hash(password, salt);
  try {
    // Check if the user exists
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      res.status(406).json("User already exists! Please login");
    }
    // creating new user
    const newUser = new users({
      userName,
      name,
      email,
      password: hashedPassword,
      phone,
    });
    // saving new user
    const response = await newUser.save();
    res.status(200).json(`User registered ${response}`);
  } catch (err) {
    res.status(401).json(`register API failed:${err}`);
    console.error(err);
  }
};

//Function to handle user login

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const existingUser = await users.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate password
    const validPassword = await bcrypt.compare(password, existingUser.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: existingUser._id }, "secretkey123");

    // Send response
    return res.status(200).json({ userId: existingUser._id, token });
  } catch (err) {
    console.error("Login error:", err);
    return res
      .status(500)
      .json({ message: "Login failed", error: err.message });
  }
};

exports.getUser = async (req, res) => {
  const userId = req.payload;
  try {
    // Check if the user exists
    const existingUser = await users.findOne({ _id: userId });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "User found", user: existingUser });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "get request failed", error: err.message });
  }
};

exports.googleLogin = async (req, res) => {
  const { email, userName, profilePic } = req.body;
  try {
    let existingUser = await user.findOne({ email });

    if (existingUser) {
      const token = jwt.sign(
        { userId: existingUser._id },
        process.env.JWT_SECRET_KEY
      );
      res.status(200).json({ user: existingUser, token });
    } else {
      const newUser = new user({
        userName,
        email,
        password: "",
        profilePic,
      });
      await newUser.save();
      const token = jwt.sign(
        { userId: newUser._id },
        process.env.JWT_SECRET_KEY
      );
      res.status(200).json({ user: newUser, token });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json("Internal Server Error");
  }
};
