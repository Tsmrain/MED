import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { protect } from '../middleware/auth';
import { AuthRequest } from '../types/express';
import { SignOptions } from 'jsonwebtoken';
import { generateVerificationCode, sendVerificationCode, sendPasswordResetCode } from '../services/smsService';

const router = express.Router();

// Register user
router.post('/register', async (req, res) => {
  try {
    console.log('Received registration request:', req.body);
    const { email, password, role, firstName, lastName, phone } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !password || !role || !phone) {
      const missingFields = [];
      if (!firstName) missingFields.push('firstName');
      if (!lastName) missingFields.push('lastName');
      if (!password) missingFields.push('password');
      if (!role) missingFields.push('role');
      if (!phone) missingFields.push('phone');
      
      console.log('Missing required fields:', missingFields);
      return res.status(400).json({
        success: false,
        error: `Campos requeridos faltantes: ${missingFields.join(', ')}`
      });
    }

    // Validate phone number format
    if (!phone.startsWith('+')) {
      console.log('Invalid phone number format:', phone);
      return res.status(400).json({
        success: false,
        error: 'El número de teléfono debe incluir el código de país (ej: +591)'
      });
    }

    // Check if user exists
    const userExists = await User.findOne({ phone });
    if (userExists) {
      console.log('Phone number already registered:', phone);
      return res.status(400).json({
        success: false,
        error: 'El número de teléfono ya está registrado'
      });
    }

    // Generate verification code
    const verificationCode = generateVerificationCode();
    const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create user
    const user = await User.create({
      email,
      password,
      role,
      firstName,
      lastName,
      phone,
      verificationCode,
      verificationCodeExpires,
      isVerified: false
    });

    // Send verification SMS
    console.log('Attempting to send verification code to:', phone);
    const smsSent = await sendVerificationCode(phone, verificationCode);
    console.log('SMS sending result:', smsSent);
    
    if (!smsSent) {
      console.error('Failed to send verification SMS. Deleting user...');
      await User.findByIdAndDelete(user._id);
      return res.status(500).json({
        success: false,
        error: 'Error al enviar el código de verificación. Por favor, intente nuevamente.'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'your-jwt-secret',
      { expiresIn: process.env.JWT_EXPIRE || '86400' } as SignOptions
    );

    // Send success response
    console.log('User registered successfully:', { phone, role });
    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: {
        phoneNumber: user.phone,
        role: user.role,
        token: token,
        username: `${user.firstName} ${user.lastName}`
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Error al registrar el usuario. Por favor, intente nuevamente.'
    });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    console.log('Login attempt:', { phoneNumber: req.body.phoneNumber });
    const { phoneNumber, password } = req.body;

    // Validate phone number format
    if (!phoneNumber || !phoneNumber.startsWith('+')) {
      console.log('Invalid phone number format:', phoneNumber);
      return res.status(400).json({
        success: false,
        error: 'El número de teléfono debe incluir el código de país (ej: +591)'
      });
    }

    // Find user by phone number
    const user = await User.findOne({ phone: phoneNumber }).select('+password');
    if (!user) {
      console.log('User not found:', phoneNumber);
      return res.status(401).json({
        success: false,
        error: 'Credenciales inválidas'
      });
    }

    // Check if user is verified
    if (!user.isVerified) {
      console.log('Unverified user attempted login:', phoneNumber);
      return res.status(401).json({
        success: false,
        error: 'Por favor, verifica tu número de teléfono antes de iniciar sesión'
      });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('Invalid password for user:', phoneNumber);
      return res.status(401).json({
        success: false,
        error: 'Credenciales inválidas'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'your-jwt-secret',
      { expiresIn: process.env.JWT_EXPIRE || '86400' } as SignOptions
    );

    // Send success response
    console.log('Login successful:', { phone: phoneNumber, role: user.role });
    res.json({
      success: true,
      message: 'Inicio de sesión exitoso',
      data: {
        phoneNumber: user.phone,
        role: user.role,
        token: token,
        username: `${user.firstName} ${user.lastName}`
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Error al iniciar sesión. Por favor, intente nuevamente.'
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

// Verify SMS code
router.post('/verify-code', async (req, res) => {
  try {
    console.log('Received verification request:', req.body);
    const { phone, code } = req.body;

    if (!phone || !code) {
      console.log('Missing phone or code');
      return res.status(400).json({
        success: false,
        error: 'Se requiere número de teléfono y código de verificación'
      });
    }

    console.log('Looking for user with phone:', phone);
    const user = await User.findOne({
      phone,
      verificationCode: code,
      verificationCodeExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Código inválido o expirado'
      });
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    await user.save();

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'your-jwt-secret',
      { expiresIn: process.env.JWT_EXPIRE || '86400' } as SignOptions
    );

    res.json({
      success: true,
      token,
      data: {
        id: user._id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al verificar el código'
    });
  }
});

// Request password reset
router.post('/reset-password', async (req, res) => {
  try {
    const { phone } = req.body;
    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'No existe una cuenta con este número de teléfono'
      });
    }

    const resetCode = generateVerificationCode();
    user.resetPasswordToken = resetCode;
    user.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save();

    const smsSent = await sendPasswordResetCode(phone, resetCode);
    if (!smsSent) {
      return res.status(500).json({
        success: false,
        error: 'Error al enviar el código de recuperación'
      });
    }

    res.json({
      success: true,
      message: 'Código de recuperación enviado',
      data: {
        resetToken: resetCode
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al procesar la solicitud'
    });
  }
});

// Reset password with code
router.post('/reset-password-confirm', async (req, res) => {
  try {
    const { phone, code, newPassword } = req.body;

    const user = await User.findOne({
      phone,
      resetPasswordToken: code,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'Código inválido o expirado'
      });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Contraseña actualizada correctamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al restablecer la contraseña'
    });
  }
});

export default router;
