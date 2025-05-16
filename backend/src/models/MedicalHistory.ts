import mongoose from 'mongoose';

const medicalHistorySchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
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
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  consultationNotes: [{
    date: Date,
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
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

export default mongoose.model('MedicalHistory', medicalHistorySchema);
