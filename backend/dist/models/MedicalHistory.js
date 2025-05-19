"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const medicalHistorySchema = new mongoose_1.default.Schema({
    patientId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    allergies: [{
            type: String
        }],
    conditions: [{
            name: String,
            diagnosedDate: Date,
            status: {
                type: String,
                enum: ['active', 'managed', 'resolved']
            }
        }],
    medications: [{
            name: String,
            dosage: String,
            frequency: String,
            startDate: Date,
            endDate: Date
        }],
    surgeries: [{
            procedure: String,
            date: Date,
            hospital: String,
            surgeon: String
        }],
    familyHistory: [{
            condition: String,
            relationship: String
        }],
    documents: [{
            title: String,
            type: {
                type: String,
                enum: ['lab_result', 'imaging', 'prescription', 'other']
            },
            fileUrl: String,
            uploadDate: Date,
            uploadedBy: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: 'User'
            }
        }],
    consultationNotes: [{
            date: Date,
            doctorId: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: 'User'
            },
            symptoms: [String],
            diagnosis: String,
            treatment: String,
            notes: String,
            aiAnalysis: String
        }]
}, {
    timestamps: true
});
exports.default = mongoose_1.default.model('MedicalHistory', medicalHistorySchema);
