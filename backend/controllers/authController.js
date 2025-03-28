const User = require('../models/User');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  const { username, email, password } = req.body;
  
  try {
    const user = new User({ username, email, password });
    await user.save();
    const token = user.generateAuthToken();
    
    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await User.findByCredentials(email, password);
    const token = user.generateAuthToken();
    
    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (err) {
    res.status(401).json({
      success: false,
      error: err.message
    });
  }
};

const getCurrentUser = async (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
};

module.exports = {
  register,
  login,
  getCurrentUser
};