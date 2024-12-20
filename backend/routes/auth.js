const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const router = express.Router();
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: "error",
        message: "Action failed."
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({
      status: "success",
      message: "Success",
      createdAt: newUser.createdAt,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ status: "error", message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ status: "error", message: "User not found" });

    const token = jwt.sign({ user: { id: user._id } }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });

    res.json({
      status: "success",
      message: "Success",
      token,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
});

module.exports = router;
