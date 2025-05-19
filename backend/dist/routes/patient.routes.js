"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const MedicalHistory_1 = __importDefault(require("../models/MedicalHistory"));
const Appointment_1 = __importDefault(require("../models/Appointment"));
const router = express_1.default.Router();
// Obtener historial médico del paciente
router.get('/medical-history', auth_1.protect, (0, auth_1.authorize)('patient'), async (req, res) => {
    try {
        let history = await MedicalHistory_1.default.findOne({ patientId: req.user?._id });
        if (!history) {
            // Crear historial automáticamente si no existe
            history = await MedicalHistory_1.default.create({
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'Error al obtener el historial médico'
        });
    }
});
// Programar una cita
router.post('/appointments', auth_1.protect, (0, auth_1.authorize)('patient'), async (req, res) => {
    try {
        const { doctorId, date, type, reason, symptoms } = req.body;
        const appointment = await Appointment_1.default.create({
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'Error al programar la cita'
        });
    }
});
// Obtener citas del paciente
router.get('/appointments', auth_1.protect, (0, auth_1.authorize)('patient'), async (req, res) => {
    try {
        const appointments = await Appointment_1.default.find({
            patientId: req.user?._id
        }).populate('doctorId', 'firstName lastName specialty');
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
// Subir documento médico
router.post('/medical-history/documents', auth_1.protect, (0, auth_1.authorize)('patient'), async (req, res) => {
    try {
        const { title, type, fileUrl } = req.body;
        const history = await MedicalHistory_1.default.findOneAndUpdate({ patientId: req.user?._id }, {
            $push: {
                documents: {
                    title,
                    type,
                    fileUrl,
                    uploadDate: new Date(),
                    uploadedBy: req.user?._id
                }
            }
        }, { new: true });
        res.json({
            success: true,
            data: history
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'Error al subir el documento'
        });
    }
});
exports.default = router;
