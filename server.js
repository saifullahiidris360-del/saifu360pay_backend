const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Temporary user storage
const users = [];

// Health check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Saifu360Pay Backend is running 🚀"
  });
});

// Register
app.post("/register", (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    const existingUser = users.find(
      user => user.email === normalizedEmail
    );

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists"
      });
    }

    const user = {
      id: Date.now().toString(),
      name: name || "",
      email: normalizedEmail,
      password: String(password),
      phone: phone || ""
    };

    users.push(user);

    res.status(201).json({
      success: true,
      message: "Registration successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error("Register error:", error);

    res.status(500).json({
      success: false,
      message: "Registration failed"
    });
  }
});

// Login
app.post("/login", (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    const user = users.find(
      user =>
        user.email === normalizedEmail &&
        user.password === String(password)
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    res.json({
      success: true,
      message: "Login successful",
      token: "saifu360pay-" + user.id,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      success: false,
      message: "Login failed"
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found",
    path: req.path
  });
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Saifu360Pay backend running on port ${PORT}`);
});
