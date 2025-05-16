import { AUTH_ENDPOINTS } from '../config/app.config';

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    token?: string;
    resetToken?: string;
    phoneNumber?: string;
    role?: string;
    username?: string;
  };
}

export const authService = {
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
  },

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
  },

  async resetPassword(resetToken: string, newPassword: string): Promise<AuthResponse> {
    try {
      const response = await fetch(AUTH_ENDPOINTS.VERIFY_CODE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resetToken, newPassword }),
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
};
