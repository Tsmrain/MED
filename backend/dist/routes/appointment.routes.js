"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const Appointment_1 = __importDefault(require("../models/Appointment"));
const smsService_1 = require("../services/smsService");
const router = express_1.default.Router();
// Obtener todas las citas
router.get('/', auth_1.protect, async (req, res) => {
    try {
        const appointments = await Appointment_1.default.find({
            $or: [
                { patientId: req.user?._id },
                { doctorId: req.user?._id }
            ]
        }).populate('patientId doctorId', 'firstName lastName email');
        res.json({
            success: true,
            data: appointments
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'Error al obtener las citas'
        });
    }
});
// Obtener una cita específica
router.get('/:id', auth_1.protect, async (req, res) => {
    try {
        const appointment = await Appointment_1.default.findById(req.params.id)
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'Error al obtener la cita'
        });
    }
});
// Crear una nueva cita
router.post('/', auth_1.protect, async (req, res) => {
    try {
        if (!req.user?._id) {
            return res.status(401).json({
                success: false,
                error: 'Usuario no autenticado'
            });
        }
        const appointment = await Appointment_1.default.create({
            ...req.body,
            patientId: req.user._id
        });
        const populatedAppointment = await Appointment_1.default.findById(appointment._id)
            .populate('patientId', 'firstName lastName phone')
            .populate('doctorId', 'firstName lastName');
        if (populatedAppointment && populatedAppointment.patientId.phone) {
            await (0, smsService_1.sendAppointmentConfirmation)(populatedAppointment.patientId.phone, populatedAppointment.date, `${populatedAppointment.doctorId.firstName} ${populatedAppointment.doctorId.lastName}`);
        }
        res.status(201).json({
            success: true,
            data: populatedAppointment
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'Error al crear la cita'
        });
    }
}); // Actualizar una cita
router.put('/:id', auth_1.protect, async (req, res) => {
    try {
        if (!req.user?._id) {
            return res.status(401).json({
                success: false,
                error: 'Usuario no autenticado'
            });
        }
        const appointment = await Appointment_1.default.findById(req.params.id);
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
        const updatedAppointment = await Appointment_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
            .populate('patientId', 'firstName lastName phone')
            .populate('doctorId', 'firstName lastName');
        if (updatedAppointment && req.body.date && updatedAppointment.patientId.phone) {
            await (0, smsService_1.sendAppointmentConfirmation)(updatedAppointment.patientId.phone, updatedAppointment.date, `${updatedAppointment.doctorId.firstName} ${updatedAppointment.doctorId.lastName}`);
        }
        res.json({
            success: true,
            data: updatedAppointment
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'Error al actualizar la cita'
        });
    }
});
// Cancelar una cita
router.put('/:id/cancel', auth_1.protect, async (req, res) => {
    try {
        const appointment = await Appointment_1.default.findById(req.params.id);
        if (!appointment) {
            return res.status(404).json({
                success: false,
                error: 'Cita no encontrada'
            });
        }
        // Verificar que el usuario sea el paciente o el médico de la cita
        if (appointment.patientId.toString() !== req.user?._id?.toString() &&
            appointment.doctorId.toString() !== req.user?._id?.toString()) {
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'Error al cancelar la cita'
        });
    }
});
exports.default = router;
