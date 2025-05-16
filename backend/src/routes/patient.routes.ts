import express from 'express';
import { protect, authorize } from '../middleware/auth';
import MedicalHistory from '../models/MedicalHistory';
import Appointment from '../models/Appointment';
import { AuthRequest } from '../types/express';

const router = express.Router();

// Obtener historial médico del paciente
router.get('/medical-history', protect, authorize('patient'), async (req: AuthRequest, res) => {
  try {
    let history = await MedicalHistory.findOne({ patientId: req.user?._id });
    
    if (!history) {
      // Crear historial automáticamente si no existe
      history = await MedicalHistory.create({
        patientId: req.user?._id,
        allergies: [],
        conditions: [],
        medications: [],
        surgeries: [],
        familyHistory: [],
        documents: [],
        consultationNotes: []
      });
    }

    res.json({
      success: true,
      data: history
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener el historial médico'
    });
  }
});

// Programar una cita
router.post('/appointments', protect, authorize('patient'), async (req: AuthRequest, res) => {
  try {
    const { doctorId, date, type, reason, symptoms } = req.body;

    const appointment = await Appointment.create({
      patientId: req.user?._id,
      doctorId,
      date,
      type,
      reason,
      symptoms,
      status: 'scheduled'
    });

    res.status(201).json({
      success: true,
      data: appointment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al programar la cita'
    });
  }
});

// Obtener citas del paciente
router.get('/appointments', protect, authorize('patient'), async (req: AuthRequest, res) => {
  try {
    const appointments = await Appointment.find({
      patientId: req.user?._id
    }).populate('doctorId', 'firstName lastName specialty');

    res.json({
      success: true,
      data: appointments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener las citas'
    });
  }
});

// Subir documento médico
router.post('/medical-history/documents', protect, authorize('patient'), async (req: AuthRequest, res) => {
  try {
    const { title, type, fileUrl } = req.body;

    const history = await MedicalHistory.findOneAndUpdate(
      { patientId: req.user?._id },
      {
        $push: {
          documents: {
            title,
            type,
            fileUrl,
            uploadDate: new Date(),
            uploadedBy: req.user?._id
          }
        }
      },
      { new: true }
    );

    res.json({
      success: true,
      data: history
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al subir el documento'
    });
  }
});

export default router;
