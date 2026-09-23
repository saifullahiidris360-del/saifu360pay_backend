const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

// Health check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Saifu360Pay Backend is running 🚀"
  });
});

// Initialize Paystack payment
app.post("/api/payment/initialize", async (req, res) => {
  try {
    const { email, amount, reference } = req.body;

    if (!email || !amount) {
      return res.status(400).json({
        success: false,
        message: "Email and amount are required"
      });
    }

    if (!PAYSTACK_SECRET_KEY) {
      return res.status(500).json({
        success: false,
        message: "Paystack secret key is not configured"
      });
    }

    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: Math.round(Number(amount) * 100),
        ...(reference ? { reference } : {})
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    return res.json({
      success: true,
      data: response.data.data
    });

  } catch (error) {
    console.error(
      "Payment initialization error:",
      error.response?.data || error.message
    );

    return res.status(500).json({
      success: false,
      message: "Unable to initialize payment"
    });
  }
});

// Verify Paystack payment
app.get("/api/payment/verify/:reference", async (req, res) => {
  try {
    const { reference } = req.params;

    if (!PAYSTACK_SECRET_KEY) {
      return res.status(500).json({
        success: false,
        message: "Paystack secret key is not configured"
      });
    }

    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`
        }
      }
    );

    return res.json({
      success: true,
      data: response.data.data
    });

  } catch (error) {
    console.error(
      "Payment verification error:",
      error.response?.data || error.message
    );

    return res.status(500).json({
      success: false,
      message: "Unable to verify payment"
    });
  }
});

app.listen(PORT, () => {
  console.log(`Saifu360Pay backend running on port ${PORT}`);
});
