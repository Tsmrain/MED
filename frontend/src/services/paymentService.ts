import { APP_CONFIG } from '../config/app.config';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

interface Payment {
  appointmentId: string;
  amount: number;
  method: 'cash' | 'qr';
  transactionId?: string;
}

const headers = {
  'Content-Type': 'application/json'
};

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    ...headers,
    Authorization: `Bearer ${token}`
  };
};

// Procesar pago
export async function processPayment(payment: Payment): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(`${APP_CONFIG.API_BASE_URL}/payments/process`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payment)
    });
    return await response.json();
  } catch (error) {
    return { success: false, error: 'Error al procesar el pago' };
  }
}

// Confirmar pago en efectivo
export async function confirmCashPayment(appointmentId: string): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(`${APP_CONFIG.API_BASE_URL}/payments/${appointmentId}/confirm-cash`, {
      method: 'PUT',
      headers: getAuthHeaders()
    });
    return await response.json();
  } catch (error) {
    return { success: false, error: 'Error al confirmar el pago en efectivo' };
  }
}

// Generar código QR para pago
export async function generatePaymentQR(appointmentId: string, amount: number): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(`${APP_CONFIG.API_BASE_URL}/payments/generate-qr`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ appointmentId, amount })
    });
    return await response.json();
  } catch (error) {
    return { success: false, error: 'Error al generar el código QR' };
  }
}

// Obtener ingresos del médico
export async function getDoctorIncome(): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(`${APP_CONFIG.API_BASE_URL}/doctors/income`, {
      headers: getAuthHeaders()
    });
    return await response.json();
  } catch (error) {
    return { success: false, error: 'Error al obtener los ingresos' };
  }
}

// Obtener historial de pagos del paciente
export async function getPatientPaymentHistory(): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(`${APP_CONFIG.API_BASE_URL}/patients/payments`, {
      headers: getAuthHeaders()
    });
    return await response.json();
  } catch (error) {
    return { success: false, error: 'Error al obtener el historial de pagos' };
  }
}
