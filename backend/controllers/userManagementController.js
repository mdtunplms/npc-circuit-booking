const bcrypt = require("bcryptjs");

const { User, Bungalow } = require("../models");

const USER_ATTRIBUTES = [
  "id",
  "full_name",
  "email",
  "institution",
  "mobile_no",
  "role",
  "assigned_bungalow_id",
  "createdAt",
  "updatedAt",
];

const VALID_ROLES = ["SUPER_ADMIN", "ADMIN", "USER"];

const bungalowInclude = {
  model: Bungalow,
  as: "assignedBungalow",
  attributes: ["id", "name", "location"],
};

const assignedBungalowForRole = (role, assignedBungalowId) => {
  if (role !== "ADMIN") {
    return null;
  }

  return assignedBungalowId || null;
};

const ensureBungalowExists = async (assignedBungalowId) => {
  if (!assignedBungalowId) {
    return true;
  }

  const bungalow = await Bungalow.findByPk(assignedBungalowId);

  return Boolean(bungalow);
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: USER_ATTRIBUTES,
      include: [bungalowInclude],
      order: [["createdAt", "DESC"]],
    });

    res.json(users);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: USER_ATTRIBUTES,
      include: [bungalowInclude],
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.createUser = async (req, res) => {
  try {
    const {
      full_name,
      email,
      password,
      institution,
      mobile_no,
      role = "USER",
      assigned_bungalow_id,
    } = req.body;

    if (!full_name || !email || !password) {
      return res.status(400).json({
        message: "Full name, email and password are required",
      });
    }

    if (!VALID_ROLES.includes(role)) {
      return res.status(400).json({
        message: "Invalid role",
      });
    }

    if (
      role === "ADMIN" &&
      !(await ensureBungalowExists(assigned_bungalow_id))
    ) {
      return res.status(404).json({
        message: "Bungalow not found",
      });
    }

    const exists = await User.findOne({
      where: { email },
    });

    if (exists) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      full_name,
      email,
      password: hashedPassword,
      institution,
      mobile_no,
      role,
      assigned_bungalow_id: assignedBungalowForRole(role, assigned_bungalow_id),
    });

    const createdUser = await User.findByPk(user.id, {
      attributes: USER_ATTRIBUTES,
      include: [bungalowInclude],
    });

    res.status(201).json(createdUser);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const {
      full_name,
      email,
      password,
      institution,
      mobile_no,
      role,
      assigned_bungalow_id,
    } = req.body;

    if (role && !VALID_ROLES.includes(role)) {
      return res.status(400).json({
        message: "Invalid role",
      });
    }

    if (email && email !== user.email) {
      const exists = await User.findOne({
        where: { email },
      });

      if (exists) {
        return res.status(400).json({
          message: "Email already exists",
        });
      }
    }

    const nextRole = role || user.role;
    const hasAssignedBungalow = Object.prototype.hasOwnProperty.call(
      req.body,
      "assigned_bungalow_id",
    );
    const nextAssignedBungalowId = hasAssignedBungalow
      ? assigned_bungalow_id
      : user.assigned_bungalow_id;

    if (
      nextRole === "ADMIN" &&
      !(await ensureBungalowExists(nextAssignedBungalowId))
    ) {
      return res.status(404).json({
        message: "Bungalow not found",
      });
    }

    const updates = {
      full_name: full_name ?? user.full_name,
      email: email ?? user.email,
      institution: institution ?? user.institution,
      mobile_no: mobile_no ?? user.mobile_no,
      role: nextRole,
      assigned_bungalow_id: assignedBungalowForRole(
        nextRole,
        nextAssignedBungalowId,
      ),
    };

    if (password) {
      updates.password = await bcrypt.hash(password, 10);
    }

    await user.update(updates);

    const updatedUser = await User.findByPk(user.id, {
      attributes: USER_ATTRIBUTES,
      include: [bungalowInclude],
    });

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    if (Number(req.params.id) === Number(req.user.id)) {
      return res.status(400).json({
        message: "You cannot delete your own account",
      });
    }

    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    await user.destroy();

    res.json({
      message: "User deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.assignAdmin = async (req, res) => {
  try {
    const { userId, bungalowId } = req.body;

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const bungalow = await Bungalow.findByPk(bungalowId);

    if (!bungalow) {
      return res.status(404).json({
        message: "Bungalow not found",
      });
    }

    await user.update({
      role: "ADMIN",
      assigned_bungalow_id: bungalow.id,
    });

    const updatedUser = await User.findByPk(user.id, {
      attributes: USER_ATTRIBUTES,
      include: [bungalowInclude],
    });

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.getBungalows = async (req, res) => {
  try {
    const bungalows = await Bungalow.findAll({
      attributes: ["id", "name", "location"],
      order: [["name", "ASC"]],
    });

    res.json(bungalows);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
