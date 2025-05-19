"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization?.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
            return res.status(401).json({
                success: false,
                error: 'No autorizado para acceder a esta ruta'
            });
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'your-jwt-secret');
            const user = await User_1.default.findById(decoded.id);
            if (!user) {
                return res.status(401).json({
                    success: false,
                    error: 'Usuario no encontrado'
                });
            }
            req.user = user;
            next();
        }
        catch (error) {
            if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                return res.status(401).json({
                    success: false,
                    error: 'Token inválido'
                });
            }
            else if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
                return res.status(401).json({
                    success: false,
                    error: 'Token expirado'
                });
            }
            res.status(500).json({
                success: false,
                error: 'Error en la autenticación'
            });
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'Error en el servidor'
        });
    }
};
exports.protect = protect;
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                error: 'No tiene permiso para acceder a esta ruta'
            });
        }
        next();
    };
};
exports.authorize = authorize;
