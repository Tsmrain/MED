import { AUTH_ENDPOINTS } from '../config/app.config';

export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: {
    token?: string;
    resetToken?: string;
    phoneNumber?: string;
    role?: string;
    username?: string;
  };
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: 'patient' | 'doctor';
}

class AuthService {
  async login(phoneNumber: string, password: string): Promise<AuthResponse> {
    try {
      const response = await fetch(AUTH_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Error en el inicio de sesión');
      }
      return data;
    } catch (error) {
      throw new Error('Error al conectar con el servidor');
    }
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await fetch(AUTH_ENDPOINTS.REGISTER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Error en el registro');
      }
      return data;
    } catch (error) {
      throw new Error('Error al conectar con el servidor');
    }
  }

  async verifyCode(phone: string, code: string): Promise<AuthResponse> {
    try {
      const response = await fetch(AUTH_ENDPOINTS.VERIFY_CODE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, code }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Código de verificación inválido');
      }
      return data;
    } catch (error) {
      throw new Error('Error al conectar con el servidor');
    }
  }

  async sendResetCode(phoneNumber: string): Promise<AuthResponse> {
    try {
      const response = await fetch(AUTH_ENDPOINTS.RESET_PASSWORD, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Error al enviar el código');
      }
      return data;
    } catch (error) {
      throw new Error('Error al conectar con el servidor');
    }
  }

  async resetPasswordConfirm(phone: string, code: string, newPassword: string): Promise<AuthResponse> {
    try {
      const response = await fetch(AUTH_ENDPOINTS.RESET_PASSWORD_CONFIRM, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, code, newPassword }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Error al restablecer la contraseña');
      }
      return data;
    } catch (error) {
      throw new Error('Error al conectar con el servidor');
    }
  }
}

export const authService = new AuthService();
