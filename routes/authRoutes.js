const express = require("express");
const router = express.Router();
const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");

//Check username/email availability
router.get("/check-availability", async (req, res) => {
  const { username, email } = req.query;
  try {
    if (username) {
      const [rows] = await db.query("SELECT id FROM users WHERE username = ?", [
        username,
      ]);
      return res.json({ available: rows.length === 0 });
    }
    if (email) {
      const [rows] = await db.query("SELECT id FROM users WHERE email = ?", [
        email,
      ]);
      return res.json({ available: rows.length === 0 });
      res.status(400).json({ error: "No query provided" });
    }
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

//REGISTER
router.post(
  "/register",
  [
    body("username")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Username must be at least 3 characters")
      .matches(/^[a-zA-Z0-9_]+$/)
      .withMessage("Username can only contain letters, numbers, underscores"),
    body("email")
      .trim()
      .isEmail()
      .withMessage("Invalid email format")
      .normalizeEmail(),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters")
      .matches(/[A-Z]/)
      .withMessage("Password must contain at least one uppercase letter")
      .matches(/[0-9]/)
      .withMessage("Password must contain at least one number"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }
    const { username, email, password, role } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      await db.query(
        "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
        [username, email, hashedPassword, role || "admin"],
      );
      res.status(201).json({ message: "User created successfully" });
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        return res.status(400).json({ error: "Username already exists" });
      }
      res.status(500).json({ error: error.message });
    }
  },
);

//LOGIN
router.post(
  "/login",
  [
    body("identifier")
      .trim()
      .notEmpty()
      .withMessage("Email or username is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { identifier, password } = req.body;
    try {
      const [rows] = await db.query(
        "SELECT * FROM users WHERE email = ? OR username = ?",
        [identifier, identifier],
      );
      if (rows.length === 0) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      const user = rows[0];
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "8h" },
      );
      res.json({ token, username: user.username, role: user.role });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
);

module.exports = router;
