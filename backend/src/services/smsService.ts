import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

export const sendSMS = async (to: string, message: string): Promise<boolean> => {
  try {
    const result = await client.messages.create({
      body: message,
      from: twilioPhone,
      to: to
    });
    
    console.log('SMS sent successfully:', result.sid);
    return true;
  } catch (error) {
    console.error('Error sending SMS:', error);
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
