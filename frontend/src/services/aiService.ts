import { APP_CONFIG } from '../config/app.config';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

const headers = {
  'Content-Type': 'application/json'
};

export async function analyzeSymptoms(symptoms: string): Promise<ApiResponse<any>> {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${APP_CONFIG.API_BASE_URL}/ai/analyze-symptoms`, {
      method: 'POST',
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ symptoms })
    });
    return await response.json();
  } catch (error) {
    return { success: false, error: 'Error al analizar síntomas' };
  }
}

export async function uploadAndAnalyzeImage(image: File, prompt?: string): Promise<ApiResponse<any>> {
  try {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('image', image);
    if (prompt) formData.append('prompt', prompt);

    const response = await fetch(`${APP_CONFIG.API_BASE_URL}/ai/analyze-image`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });
    return await response.json();
  } catch (error) {
    return { success: false, error: 'Error al analizar la imagen' };
  }
}

export async function analyzeDocument(documentText: string): Promise<ApiResponse<any>> {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${APP_CONFIG.API_BASE_URL}/ai/analyze-document`, {
      method: 'POST',
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ documentText })
    });
    return await response.json();
  } catch (error) {
    return { success: false, error: 'Error al analizar el documento' };
  }
}

export async function chatWithAI(message: string, chatHistory: any[]): Promise<ApiResponse<any>> {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${APP_CONFIG.API_BASE_URL}/ai/chat`, {
      method: 'POST',
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ message, chatHistory })
    });
    return await response.json();
  } catch (error) {
    return { success: false, error: 'Error en el chat médico' };
  }
}
