const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { User } = require("../models");

exports.register = async (req, res) => {
  try {
    const { full_name, email, password } = req.body;

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      full_name,
      email,
      password: hash,
    });

    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
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
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
