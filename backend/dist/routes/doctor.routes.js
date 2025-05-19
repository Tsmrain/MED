"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const User_1 = __importDefault(require("../models/User"));
const Appointment_1 = __importDefault(require("../models/Appointment"));
const router = express_1.default.Router();
// Obtener todos los médicos
router.get('/', auth_1.protect, async (req, res) => {
    try {
        const doctors = await User_1.default.find({ role: 'doctor' }).select('-password');
        res.json({
            success: true,
            data: doctors
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'Error al obtener la lista de médicos'
        });
    }
});
// Obtener médicos por especialidad
router.get('/specialty/:specialty', auth_1.protect, async (req, res) => {
    try {
        const doctors = await User_1.default.find({
            role: 'doctor',
            specialty: req.params.specialty
        }).select('-password');
        res.json({
            success: true,
            data: doctors
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'Error al obtener médicos por especialidad'
        });
    }
});
// Obtener citas del día para un médico
router.get('/appointments/today', auth_1.protect, (0, auth_1.authorize)('doctor'), async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const appointments = await Appointment_1.default.find({
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'Error al obtener las citas del día'
        });
    }
});
// Obtener ingresos del médico
router.get('/income', auth_1.protect, (0, auth_1.authorize)('doctor'), async (req, res) => {
    try {
        const appointments = await Appointment_1.default.find({
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: 'Error al obtener los ingresos'
        });
    }
});
exports.default = router;
