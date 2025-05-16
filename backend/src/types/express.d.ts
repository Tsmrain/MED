import { Request } from 'express';
import { IUser } from '../models/User';

export interface AuthRequest extends Request {
  user?: IUser;
}

// Export other types that might be needed across the application
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}
