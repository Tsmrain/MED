"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateVerificationCode = exports.sendPasswordResetCode = exports.sendVerificationCode = exports.sendAppointmentReminder = exports.sendAppointmentConfirmation = exports.sendSMS = void 0;
const twilio_1 = __importDefault(require("twilio"));
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;
if (!accountSid || !authToken || !twilioPhone) {
    console.error('Twilio configuration missing. SMS services will not work.');
}
const client = (0, twilio_1.default)(accountSid, authToken);
// Helper function to format phone numbers
const formatPhoneNumber = (phoneNumber) => {
    // Remove any non-digit characters
    const digitsOnly = phoneNumber.replace(/\D/g, '');
    // If number doesn't start with +, add it
    if (!phoneNumber.startsWith('+')) {
        return `+${digitsOnly}`;
    }
    return phoneNumber;
};
const sendSMS = async (to, message) => {
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
    }
    catch (error) {
        console.error('Error sending SMS:', error);
        // Log detailed error for debugging
        if (error instanceof Error) {
            console.error('Error details:', {
                message: error.message,
                code: error.code,
                status: error.status,
            });
        }
        return false;
    }
};
exports.sendSMS = sendSMS;
const sendAppointmentConfirmation = async (phoneNumber, appointmentDate, doctorName) => {
    const formattedDate = appointmentDate.toLocaleDateString('es-BO', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    const message = `Su cita médica con Dr. ${doctorName} está confirmada para el ${formattedDate}. Por favor llegue 10 minutos antes.`;
    return (0, exports.sendSMS)(phoneNumber, message);
};
exports.sendAppointmentConfirmation = sendAppointmentConfirmation;
const sendAppointmentReminder = async (phoneNumber, appointmentDate, doctorName) => {
    const formattedDate = appointmentDate.toLocaleDateString('es-BO', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    const message = `Recordatorio: Tiene una cita médica con Dr. ${doctorName} mañana ${formattedDate}. Por favor confirme su asistencia.`;
    return (0, exports.sendSMS)(phoneNumber, message);
};
exports.sendAppointmentReminder = sendAppointmentReminder;
const sendVerificationCode = async (phoneNumber, code) => {
    const message = `Tu código de verificación para DIAGNOSIA es: ${code}. Válido por 10 minutos.`;
    return (0, exports.sendSMS)(phoneNumber, message);
};
exports.sendVerificationCode = sendVerificationCode;
const sendPasswordResetCode = async (phoneNumber, code) => {
    const message = `Tu código para restablecer la contraseña en DIAGNOSIA es: ${code}. Válido por 10 minutos.`;
    return (0, exports.sendSMS)(phoneNumber, message);
};
exports.sendPasswordResetCode = sendPasswordResetCode;
// Función auxiliar para generar códigos de verificación
const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
exports.generateVerificationCode = generateVerificationCode;
