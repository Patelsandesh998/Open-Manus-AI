import express from 'express';
import User from '../models/User.js';
import { generateToken } from '../utils/jwt.js';

const router = express.Router();

// @route   POST /api/auth/signup
// @desc    Register a new user
// @access  Public
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt
        },
        token
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages[0] || 'Validation error'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find user and include password
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
          lastLogin: user.lastLogin
        },
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', async (req, res) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no token'
      });
    }

    // Verify token
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
          lastLogin: user.lastLogin
        }
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(401).json({
      success: false,
      message: 'Not authorized'
    });
  }
});

// @route   POST /api/auth/oauth
// @desc    Handle OAuth authentication (Google, Microsoft, Apple)
// @access  Public
router.post('/oauth', async (req, res) => {
  try {
    const { provider, token, userData } = req.body;

    // Validate input
    if (!provider || !userData || !userData.email) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OAuth data'
      });
    }

    // Validate provider
    if (!['google', 'microsoft', 'apple'].includes(provider)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid authentication provider'
      });
    }

    const { email, name, providerId, picture } = userData;

    // Check if user exists with this email
    let user = await User.findOne({ email });

    if (user) {
      // User exists - update their info and login
      user.lastLogin = new Date();
      if (picture && !user.picture) {
        user.picture = picture;
      }
      await user.save();
    } else {
      // Create new user with OAuth
      user = await User.create({
        name: name || email.split('@')[0],
        email,
        authProvider: provider,
        providerId: providerId || email,
        picture: picture || '',
        password: Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8) // Random password for OAuth users
      });
    }

    // Generate token
    const authToken = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'OAuth authentication successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          authProvider: user.authProvider,
          picture: user.picture,
          createdAt: user.createdAt,
          lastLogin: user.lastLogin
        },
        token: authToken
      }
    });
  } catch (error) {
    console.error('OAuth error:', error);
    res.status(500).json({
      success: false,
      message: 'OAuth authentication failed'
    });
  }
});

export default router;
