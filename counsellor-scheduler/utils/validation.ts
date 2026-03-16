import { z } from 'zod';

export const guestLoginSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
});

export const adminLoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const bookAppointmentSchema = z.object({
  slotId: z.string().uuid('Invalid slot ID'),
  topic: z.string().min(5, 'Topic must be at least 5 characters'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  time: z.string().regex(/^\d{2}:\d{2}$/, 'Time must be in HH:MM format'),
});

export const createSlotSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  time: z.string().regex(/^\d{2}:\d{2}$/, 'Time must be in HH:MM format'),
});

export const cancelAppointmentSchema = z.object({
  appointmentId: z.string().uuid('Invalid appointment ID'),
});

export const removeSlotSchema = z.object({
  slotId: z.string().uuid('Invalid slot ID'),
});
