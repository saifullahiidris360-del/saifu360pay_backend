
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

// Test route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Saifu360Pay Backend is running 🚀"
  });
});

// REGISTER
app.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Name, email and password are required"
    });
  }

  const existingUser = users.find(
    user => user.email.toLowerCase() === email.toLowerCase()
  );

  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: "User already exists"
    });
  }

  const user = {
    id: Date.now().toString(),
    name,
    email,
    password
  };

  users.push(user);

  res.json({
    success: true,
    message: "Registration successful",
    user: {
      id: user.id,
      name: user.name,
      email: user.email
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

  const user = users.find(
    user =>
      user.email.toLowerCase() === email.toLowerCase() &&
      user.password === password
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
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  });
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Saifu360Pay backend running on port ${PORT}`);
});
