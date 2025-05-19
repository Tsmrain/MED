import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

if (!accountSid || !authToken || !twilioPhone) {
  console.error('Twilio configuration missing. SMS services will not work.');
}

const client = twilio(accountSid, authToken);

// Helper function to format phone numbers
const formatPhoneNumber = (phoneNumber: string): string => {
  // Remove any non-digit characters
  const digitsOnly = phoneNumber.replace(/\D/g, '');
  
  // If number doesn't start with +, add it
  if (!phoneNumber.startsWith('+')) {
    return `+${digitsOnly}`;
  }
  
  return phoneNumber;
};

export const sendSMS = async (to: string, message: string): Promise<boolean> => {
  try {
    const formattedNumber = formatPhoneNumber(to);
    console.log(`Attempting to send SMS to ${formattedNumber}`);
    
    const result = await client.messages.create({
      body: message,
      from: twilioPhone,
      to: formattedNumber
    });
    
    console.log('SMS sent successfully:', result.sid);
    return true;
  } catch (error) {
    console.error('Error sending SMS:', error);
    // Log detailed error for debugging
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        code: (error as any).code,
        status: (error as any).status,
      });
    }
    return false;
  }
};

export const sendAppointmentConfirmation = async (
  phoneNumber: string, 
  appointmentDate: Date,
  doctorName: string
): Promise<boolean> => {
  const formattedDate = appointmentDate.toLocaleDateString('es-BO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const message = `Su cita médica con Dr. ${doctorName} está confirmada para el ${formattedDate}. Por favor llegue 10 minutos antes.`;
  
  return sendSMS(phoneNumber, message);
};

export const sendAppointmentReminder = async (
  phoneNumber: string,
  appointmentDate: Date,
  doctorName: string
): Promise<boolean> => {
  const formattedDate = appointmentDate.toLocaleDateString('es-BO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const message = `Recordatorio: Tiene una cita médica con Dr. ${doctorName} mañana ${formattedDate}. Por favor confirme su asistencia.`;
  
  return sendSMS(phoneNumber, message);
};

export const sendVerificationCode = async (phoneNumber: string, code: string): Promise<boolean> => {
  const message = `Tu código de verificación para DIAGNOSIA es: ${code}. Válido por 10 minutos.`;
  return sendSMS(phoneNumber, message);
};

export const sendPasswordResetCode = async (phoneNumber: string, code: string): Promise<boolean> => {
  const message = `Tu código para restablecer la contraseña en DIAGNOSIA es: ${code}. Válido por 10 minutos.`;
  return sendSMS(phoneNumber, message);
};

// Función auxiliar para generar códigos de verificación
export const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
