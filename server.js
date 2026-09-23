const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 10000;

// Test endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Saifu360Pay Backend is running 🚀"
  });
});

// REGISTER
app.post("/register", (req, res) => {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Name, email and password are required"
    });
  }

  res.json({
    success: true,
    message: "Registration successful",
    user: {
      name,
      email,
      phone: phone || ""
    }
  });
});

// LOGIN
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required"
    });
  }

  res.json({
    success: true,
    message: "Login successful",
    user: {
      email
    }
  });
});

// Health check
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Backend healthy"
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Saifu360Pay backend running on port ${PORT}`);
});
