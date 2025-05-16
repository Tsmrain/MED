import { APP_CONFIG } from '../config/app.config';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

interface Document {
  title: string;
  type: 'lab_result' | 'imaging' | 'prescription' | 'other';
  fileUrl: string;
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

// Obtener historial médico
export async function getMedicalHistory(): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(`${APP_CONFIG.API_BASE_URL}/patients/medical-history`, {
      headers: getAuthHeaders()
    });
    return await response.json();
  } catch (error) {
    return { success: false, error: 'Error al obtener el historial médico' };
  }
}

// Subir documento médico
export async function uploadMedicalDocument(document: Document): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(`${APP_CONFIG.API_BASE_URL}/patients/medical-history/documents`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(document)
    });
    return await response.json();
  } catch (error) {
    return { success: false, error: 'Error al subir el documento' };
  }
}

// Obtener documentos médicos
export async function getMedicalDocuments(): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(`${APP_CONFIG.API_BASE_URL}/patients/medical-history/documents`, {
      headers: getAuthHeaders()
    });
    return await response.json();
  } catch (error) {
    return { success: false, error: 'Error al obtener los documentos' };
  }
}

// Actualizar historial médico
export async function updateMedicalHistory(data: any): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(`${APP_CONFIG.API_BASE_URL}/patients/medical-history`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return await response.json();
  } catch (error) {
    return { success: false, error: 'Error al actualizar el historial médico' };
  }
}

// Obtener historial médico de un paciente (para médicos)
export async function getPatientMedicalHistory(patientId: string): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(`${APP_CONFIG.API_BASE_URL}/doctors/patients/${patientId}/medical-history`, {
      headers: getAuthHeaders()
    });
    return await response.json();
  } catch (error) {
    return { success: false, error: 'Error al obtener el historial médico del paciente' };
  }
}

// Agregar nota de consulta
export async function addConsultationNote(patientId: string, note: any): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(`${APP_CONFIG.API_BASE_URL}/doctors/patients/${patientId}/consultation-notes`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(note)
    });
    return await response.json();
  } catch (error) {
    return { success: false, error: 'Error al agregar la nota de consulta' };
  }
}
