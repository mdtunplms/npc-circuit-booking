const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { User } = require("../models");

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || ""));
}

exports.register = async (req, res) => {
  try {
    const {
      full_name,
      email,
      password,
      institution,
      mobile_no,
    } = req.body;

    if (!full_name || !email || !password) {
      return res.status(400).json({
        message: "Full name, email and password are required",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        message: "Valid email is required",
      });
    }

    if (String(password).length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const exists = await User.findOne({
      where: { email: String(email).trim().toLowerCase() },
    });

    if (exists) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      full_name,
      email: String(email).trim().toLowerCase(),
      password: hash,
      institution,
      mobile_no,
    });

    res.status(201).json({
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      institution: user.institution,
      mobile_no: user.mobile_no,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({
      where: { email: String(email).trim().toLowerCase() },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(400).json({
        message: "Invalid Password",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        assigned_bungalow_id: user.assigned_bungalow_id,
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "7d",
      },
    );

    res.json({
      token,

      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        institution: user.institution,
        mobile_no: user.mobile_no,
        role: user.role,
        assigned_bungalow_id: user.assigned_bungalow_id,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
