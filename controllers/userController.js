const { User } = require('../models'); // Adjust path to your models
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const { ALL_ROLES } = require('../utils/roles');

// Create a new user
const createUser = async (req, res) => {
  try {
    console.log("📥 req.body:", req.body);
    console.log("🔎 Allowed roles:", ALL_ROLES);
    let { name, email="", password, role } = req.body;
    email = email.toLowerCase();
    // Validate required fields
    if (!name || !email || !password || !role || !ALL_ROLES.includes(role)) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      id: uuidv4(),
      name,
      email,
      password: hashedPassword,
      role,
    });

    // Remove password from response
    const { password: _, ...userData } = user.get();
    return res.status(201).json(userData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
    });
    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, status } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update fields
    const updatedData = {};
    if (name) updatedData.name = name;
    if (email) updatedData.email = email;
    if (role) updatedData.role = role;
    if (status) updatedData.status = status;

    await user.update(updatedData);
    const { password: _, ...userData } = user.get();
    return res.status(200).json(userData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.destroy();
    return res.status(204).json();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
