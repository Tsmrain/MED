import express from 'express';
import { protect, authorize } from '../middleware/auth';
import MedicalHistory from '../models/MedicalHistory';
import User from '../models/User';
import Appointment from '../models/Appointment';
import { AuthRequest } from '../types/express';

const router = express.Router();

// Obtener todos los médicos
router.get('/', protect, async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' }).select('-password');
    res.json({
      success: true,
      data: doctors
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener la lista de médicos'
    });
  }
});

// Obtener médicos por especialidad
router.get('/specialty/:specialty', protect, async (req, res) => {
  try {
    const doctors = await User.find({
      role: 'doctor',
      specialty: req.params.specialty
    }).select('-password');
    
    res.json({
      success: true,
      data: doctors
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener médicos por especialidad'
    });
  }
});

// Obtener citas del día para un médico
router.get('/appointments/today', protect, authorize('doctor'), async (req: AuthRequest, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const appointments = await Appointment.find({
      doctorId: req.user?._id,
      date: {
        $gte: today,
        $lt: tomorrow
      }
    }).populate('patientId', 'firstName lastName email');

    res.json({
      success: true,
      data: appointments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener las citas del día'
    });
  }
});

// Obtener ingresos del médico
router.get('/income', protect, authorize('doctor'), async (req: AuthRequest, res) => {
  try {
    const appointments = await Appointment.find({
      doctorId: req.user?._id,
      'payment.status': 'completed'
    });

    const totalIncome = appointments.reduce((acc, curr) => acc + (curr.payment?.amount || 0), 0);

    res.json({
      success: true,
      data: {
        totalIncome,
        appointments
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener los ingresos'
    });
  }
});

export default router;
