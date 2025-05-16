import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { AuthRequest } from '../types/express';

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
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
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-jwt-secret') as { id: string };
      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Usuario no encontrado'
        });
      }

      req.user = user;
      next();
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({
          success: false,
          error: 'Token inválido'
        });
      } else if (error instanceof jwt.TokenExpiredError) {
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
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error en el servidor'
    });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'No tiene permiso para acceder a esta ruta'
      });
    }
    next();
  };
};
