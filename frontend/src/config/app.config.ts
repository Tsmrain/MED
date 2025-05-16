export const APP_CONFIG = {
  API_BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  ENV: import.meta.env.VITE_ENV || 'development',
} as const;

export const AUTH_ENDPOINTS = {
  LOGIN: `${APP_CONFIG.API_BASE_URL}/auth/login`,
  RESET_PASSWORD: `${APP_CONFIG.API_BASE_URL}/auth/reset-password`,
  VERIFY_CODE: `${APP_CONFIG.API_BASE_URL}/auth/verify-code`
} as const;

export const SUPPORTED_COUNTRIES = [
  { code: 'BO', name: 'Bolivia', flag: 'BO', dialCode: '+591' },
  { code: 'AR', name: 'Argentina', flag: 'AR', dialCode: '+54' },
  { code: 'PE', name: 'Perú', flag: 'PE', dialCode: '+51' }
] as const;
