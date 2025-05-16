import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { protect } from '../middleware/auth';
import { AuthRequest } from '../types/express';
import { SignOptions } from 'jsonwebtoken';

const router = express.Router();

// Register user
router.post('/register', async (req, res) => {
  try {
    const { email, password, role, firstName, lastName, phone } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        error: 'El usuario ya existe'
      });
    }

    const user = await User.create({
      email,
      password,
      role,
      firstName,
      lastName,
      phone
    });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'your-jwt-secret',
      { expiresIn: parseInt(process.env.JWT_EXPIRE || '86400') }
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al registrar el usuario'
    });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Credenciales inválidas'
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Credenciales inválidas'
      });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'your-jwt-secret',
      { expiresIn: parseInt(process.env.JWT_EXPIRE || '86400', 10) }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al iniciar sesión'
    });
  }
});

// Get current user
router.get('/me', protect, async (req: AuthRequest, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ success: false, error: 'Usuario no autenticado' });
    }
    const user = await User.findById(req.user._id);
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener el usuario'
    });
  }
});

export default router;
