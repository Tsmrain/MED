import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';

// Import routes
import aiRoutes from './routes/ai.routes';
import authRoutes from './routes/auth.routes';
import patientRoutes from './routes/patient.routes';
import doctorRoutes from './routes/doctor.routes';
import appointmentRoutes from './routes/appointment.routes';

dotenv.config();

const app = express();

// Middlewares
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/patients', patientRoutes);
app.use('/api/v1/doctors', doctorRoutes);
app.use('/api/v1/appointments', appointmentRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'development' ? err.message : 'Server Error'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
