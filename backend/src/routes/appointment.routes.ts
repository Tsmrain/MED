import express from 'express';
import { protect, authorize } from '../middleware/auth';
import Appointment from '../models/Appointment';
import { AuthRequest } from '../types/express';
import { Types } from 'mongoose';
import { IUser } from '../models/User';
import { sendAppointmentConfirmation, sendAppointmentReminder } from '../services/smsService';

const router = express.Router();

// Obtener todas las citas
router.get('/', protect, async (req: AuthRequest, res) => {
  try {
    const appointments = await Appointment.find({
      $or: [
        { patientId: req.user?._id },
        { doctorId: req.user?._id }
      ]
    }).populate('patientId doctorId', 'firstName lastName email');

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

// Obtener una cita específica
router.get('/:id', protect, async (req: AuthRequest, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patientId doctorId', 'firstName lastName email');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: 'Cita no encontrada'
      });
    }

    res.json({
      success: true,
      data: appointment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener la cita'
    });
  }
});

// Crear una nueva cita
router.post('/', protect, async (req: AuthRequest, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        error: 'Usuario no autenticado'
      });
    }

    const appointment = await Appointment.create({
      ...req.body,
      patientId: req.user._id
    });

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate<{ patientId: IUser }>('patientId', 'firstName lastName phone')
      .populate<{ doctorId: IUser }>('doctorId', 'firstName lastName');

    if (populatedAppointment && populatedAppointment.patientId.phone) {
      await sendAppointmentConfirmation(
        populatedAppointment.patientId.phone,
        populatedAppointment.date,
        `${(populatedAppointment.doctorId as IUser).firstName} ${(populatedAppointment.doctorId as IUser).lastName}`
      );
    }

    res.status(201).json({
      success: true,
      data: populatedAppointment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al crear la cita'
    });
  }
});  // Actualizar una cita
router.put('/:id', protect, async (req: AuthRequest, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        error: 'Usuario no autenticado'
      });
    }

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: 'Cita no encontrada'
      });
    }

    // Verificar que el usuario sea el paciente o el médico de la cita
    if (appointment.patientId.toString() !== req.user._id.toString() &&
        appointment.doctorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'No autorizado para modificar esta cita'
      });
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate<{ patientId: IUser }>('patientId', 'firstName lastName phone')
      .populate<{ doctorId: IUser }>('doctorId', 'firstName lastName');

    if (updatedAppointment && req.body.date && (updatedAppointment.patientId as IUser).phone) {
      await sendAppointmentConfirmation(
        (updatedAppointment.patientId as IUser).phone,
        updatedAppointment.date,
        `${(updatedAppointment.doctorId as IUser).firstName} ${(updatedAppointment.doctorId as IUser).lastName}`
      );
    }

    res.json({
      success: true,
      data: updatedAppointment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al actualizar la cita'
    });
  }
});

// Cancelar una cita
router.put('/:id/cancel', protect, async (req: AuthRequest, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: 'Cita no encontrada'
      });
    }

    // Verificar que el usuario sea el paciente o el médico de la cita
    if (appointment.patientId.toString() !== (req.user?._id as any)?.toString() &&
        appointment.doctorId.toString() !== (req.user?._id as any)?.toString()) {
      return res.status(403).json({
        success: false,
        error: 'No autorizado para cancelar esta cita'
      });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    res.json({
      success: true,
      data: appointment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al cancelar la cita'
    });
  }
});

export default router;
