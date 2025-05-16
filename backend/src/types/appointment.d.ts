import { Document, Types } from 'mongoose';
import { IUser } from '../models/User';

export interface IAppointment extends Document {
  patientId: IUser | Types.ObjectId;
  doctorId: IUser | Types.ObjectId;
  date: Date;
  status: 'pending' | 'confirmed' | 'cancelled';
  description: string;
  createdAt: Date;
  updatedAt: Date;
}
