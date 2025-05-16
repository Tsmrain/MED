import { APP_CONFIG } from '../config/app.config';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

interface Appointment {
  doctorId: string;
  date: Date;
  type: 'virtual' | 'presential';
  reason: string;
  symptoms?: string[];
}

const headers = {
  'Content-Type': 'application/json'
};

// Obtener token de autenticación
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    ...headers,
    Authorization: `Bearer ${token}`
  };
};

// Programar cita
export async function scheduleAppointment(appointment: Appointment): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(`${APP_CONFIG.API_BASE_URL}/patients/appointments`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(appointment)
    });
    return await response.json();
  } catch (error) {
    return { success: false, error: 'Error al programar la cita' };
  }
}

// Obtener citas del paciente
export async function getPatientAppointments(): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(`${APP_CONFIG.API_BASE_URL}/patients/appointments`, {
      headers: getAuthHeaders()
    });
    return await response.json();
  } catch (error) {
    return { success: false, error: 'Error al obtener las citas' };
  }
}

// Obtener citas del día (para médicos)
export async function getDoctorDailyAppointments(): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(`${APP_CONFIG.API_BASE_URL}/doctors/appointments/today`, {
      headers: getAuthHeaders()
    });
    return await response.json();
  } catch (error) {
    return { success: false, error: 'Error al obtener las citas del día' };
  }
}

// Reprogramar cita
export async function rescheduleAppointment(appointmentId: string, newDate: Date): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(`${APP_CONFIG.API_BASE_URL}/appointments/${appointmentId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ date: newDate })
    });
    return await response.json();
  } catch (error) {
    return { success: false, error: 'Error al reprogramar la cita' };
  }
}

// Cancelar cita
export async function cancelAppointment(appointmentId: string): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(`${APP_CONFIG.API_BASE_URL}/appointments/${appointmentId}/cancel`, {
      method: 'PUT',
      headers: getAuthHeaders()
    });
    return await response.json();
  } catch (error) {
    return { success: false, error: 'Error al cancelar la cita' };
  }
}
