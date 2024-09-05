const express = require("express");
const users = require("../Models/userSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

//Function to handle user registration
exports.register = async (req, res) => {
  const { userName, name, email, password, phone } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    // Check if the user exists
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ error: "User already exists! Please login" });
    }

    // Hashing password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Creating new user
    const newUser = new users({
      name,
      email,
      password: hashedPassword,
      phone,
    });

    // Saving new user
    const response = await newUser.save();
    return res
      .status(201)
      .json({ message: "User registered successfully", user: response });
  } catch (err) {
    console.error("Register API failed:", err);
    return res.status(500).json({ error: "Internal server error" });
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
  const { email, name, profilePic } = req.body;
  try {
    let existingUser = await users.findOne({ email });

    if (existingUser) {
      const token = jwt.sign(
        { userId: existingUser._id },
        process.env.JWT_SECRET_KEY
      );
      res.status(200).json({ user: existingUser, token });
    } else {
      const newUser = new users({
        name,
        email,
        password: "",
      });
      const respnse = await newUser.save();
      console.log(respnse);
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

//GENERATING OTP FOR EMAIL VERIFICATION USING NODEMAILER
exports.genOtp = async (req, res) => {
  const { email } = req.body;
  console.log(email);
  // Validate email
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const otp = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP
    const expiresAt = Date.now() + 5 * 60 * 1000; // OTP valid for 5 minutes

    // Store OTP in session
    req.session.otp = { value: otp, expiresAt };

    // Configure the email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.PASS,
      },
    });

    // Email Body
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Email Verification",
      text: "Your verification OTP",
      html: `<body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
            <h2 style="text-align: center; color: #4CAF50;">Verify Your Email Address</h2>
            <p style="font-size: 16px;">Hello,</p>
            <p style="font-size: 16px;">Thank you for signing up. Please use the following OTP to complete your registration:</p>
            <div style="text-align: center; margin: 20px 0;">
              <span style="display: inline-block; padding: 10px 20px; font-size: 24px; font-weight: bold; color: #4CAF50; border:2px solid #4CAF50; border-radius: 5px;">${otp}</span>
            </div>
          </div>
        </body>`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Respond to the client
    res.status(200).send({ message: "OTP generated" });
  } catch (error) {
    console.error("Error generating or sending OTP:", error);
  }
};

// CONTROLLER TO VERIFY OTP GENERATED
exports.verOtp = (req, res) => {
  const { otp } = req.body;

  // Check if OTP is provided
  if (!otp) {
    return res.status(400).json({ message: "OTP is required" });
  }

  try {
    // Validate OTP
    if (
      req.session.otp &&
      req.session.otp.value == otp &&
      req.session.otp.expiresAt > Date.now()
    ) {
      // OTP is valid
      res.status(200).send("OTP verified successfully");
    } else {
      // OTP is invalid or expired
      res.status(400).json({ message: "Invalid or expired OTP" });
    }
  } catch (error) {
    // Log error for debugging
    console.error("Error verifying OTP:", error);
    // Respond with a generic error message
    res.status(500).json({
      message: "An error occurred while verifying OTP. Please try again later.",
    });
  }
};
