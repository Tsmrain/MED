"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const appointmentSchema = new mongoose_1.default.Schema({
    patientId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    doctorId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    type: {
        type: String,
        enum: ['virtual', 'presential'],
        required: true
    },
    status: {
        type: String,
        enum: ['scheduled', 'completed', 'cancelled', 'no-show'],
        default: 'scheduled'
    },
    reason: {
        type: String,
        required: true
    },
    symptoms: [{
            type: String
        }],
    aiPreAnalysis: {
        type: String
    },
    notes: {
        type: String
    },
    documents: [{
            title: String,
            fileUrl: String,
            uploadDate: Date
        }],
    payment: {
        amount: Number,
        status: {
            type: String,
            enum: ['pending', 'completed'],
            default: 'pending'
        },
        method: {
            type: String,
            enum: ['cash', 'qr'],
            required: true
        },
        transactionId: String
    }
}, {
    timestamps: true
});
exports.default = mongoose_1.default.model('Appointment', appointmentSchema);
