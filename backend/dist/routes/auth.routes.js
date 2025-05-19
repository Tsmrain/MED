"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const auth_1 = require("../middleware/auth");
const smsService_1 = require("../services/smsService");
const router = express_1.default.Router();
// Register user
router.post('/register', async (req, res) => {
    try {
        const { email, password, role, firstName, lastName, phone } = req.body;
        const userExists = await User_1.default.findOne({ phone });
        if (userExists) {
            return res.status(400).json({
                success: false,
                error: 'El número de teléfono ya está registrado'
            });
        }
        const verificationCode = (0, smsService_1.generateVerificationCode)();
        const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        const user = await User_1.default.create({
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
        // Enviar código de verificación por SMS
        const smsSent = await (0, smsService_1.sendVerificationCode)(phone, verificationCode);
        if (!smsSent) {
            await User_1.default.findByIdAndDelete(user._id);
            return res.status(500).json({
                success: false,
                error: 'Error al enviar el código de verificación'
            });
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET || 'your-jwt-secret', { expiresIn: process.env.JWT_EXPIRE || '86400' });
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'Error al registrar el usuario'
        });
    }
});
// Login user
router.post('/login', async (req, res) => {
    try {
        const { phoneNumber, password } = req.body;
        const user = await User_1.default.findOne({ phone: phoneNumber }).select('+password');
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
        const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET || 'your-jwt-secret', { expiresIn: parseInt(process.env.JWT_EXPIRE || '86400', 10) });
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'Error al iniciar sesión'
        });
    }
});
// Get current user
router.get('/me', auth_1.protect, async (req, res) => {
    try {
        if (!req.user?._id) {
            return res.status(401).json({ success: false, error: 'Usuario no autenticado' });
        }
        const user = await User_1.default.findById(req.user._id);
        res.json({
            success: true,
            data: user
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'Error al obtener el usuario'
        });
    }
});
// Verify SMS code
router.post('/verify-code', async (req, res) => {
    try {
        const { phone, code } = req.body;
        const user = await User_1.default.findOne({
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
        const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET || 'your-jwt-secret', { expiresIn: process.env.JWT_EXPIRE || '86400' });
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
    }
    catch (error) {
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
        const user = await User_1.default.findOne({ phone });
        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'No existe una cuenta con este número de teléfono'
            });
        }
        const resetCode = (0, smsService_1.generateVerificationCode)();
        user.resetPasswordToken = resetCode;
        user.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        await user.save();
        const smsSent = await (0, smsService_1.sendPasswordResetCode)(phone, resetCode);
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
    }
    catch (error) {
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
        const user = await User_1.default.findOne({
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'Error al restablecer la contraseña'
        });
    }
});
exports.default = router;
