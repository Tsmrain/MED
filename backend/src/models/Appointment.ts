import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
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

export default mongoose.model('Appointment', appointmentSchema);
