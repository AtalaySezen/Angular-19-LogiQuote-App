const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/tokenIsValid", (req, res) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) return res.status(401).json({ valid: false });

  const token = authHeader.replace("Bearer ", "");
  if (!token) return res.status(401).json({ valid: false });

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    res.json({ valid: true });
  } catch (err) {
    res.json({ valid: false });
  }
});

module.exports = router;
