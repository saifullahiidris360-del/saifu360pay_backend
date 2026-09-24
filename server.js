
const express = require("express");
const cors = require("cors");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 10000;

// ===============================
// MIDDLEWARE
// ===============================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===============================
// TEMPORARY USER STORAGE
// ===============================
// Wannan na gwaji ne. Daga baya za mu haɗa database.
const users = [];

// ===============================
// HOME / HEALTH CHECK
// ===============================
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Saifu360Pay Backend is running 🚀",
    endpoints: {
      register: "/register",
      login: "/login"
    }
  });
});

// ===============================
// REGISTER
// ===============================
app.post("/register", (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    const cleanEmail = String(email).trim().toLowerCase();

    const existingUser = users.find(
      user => user.email === cleanEmail
    );

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists"
      });
    }

    const user = {
      id: crypto.randomUUID(),
      name: name || "",
      email: cleanEmail,
      phone: phone || "",
      password: password,
      walletBalance: 0,
      createdAt: new Date().toISOString()
    };

    users.push(user);

    res.status(201).json({
      success: true,
      message: "Registration successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        walletBalance: user.walletBalance
      }
    });

  } catch (error) {
    console.error("REGISTER ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Registration failed"
    });
  }
});

// ===============================
// LOGIN
// ===============================
app.post("/login", (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    const cleanEmail = String(email).trim().toLowerCase();

    const
