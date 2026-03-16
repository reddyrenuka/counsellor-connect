import { Appointment } from '../types/appointment';
import { getData, writeData } from '../utils/fileLoader';
import { generateId } from '../utils/idGenerator';
import { markSlotAsBooked, markSlotAsAvailable } from './slotService';

export function bookAppointment(
  clientEmail: string,
  clientName: string,
  slotId: string,
  topic: string,
  date: string,
  time: string
): Appointment {
  const data = getData();

  // Verify slot is available
  const slot = data.slots.find(s => s.slotId === slotId);
  if (!slot) {
    throw new Error('Slot not found');
  }

  if (slot.status === 'booked') {
    throw new Error('Slot is already booked');
  }

  // Create appointment
  const newAppointment: Appointment = {
    id: generateId(),
    clientEmail: clientEmail.toLowerCase(),
    clientName,
    slotId,
    date,
    time,
    topic,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  data.appointments.push(newAppointment);
  writeData('appointments', data.appointments);

  // Mark slot as booked
  markSlotAsBooked(slotId);

  return newAppointment;
}

export function cancelAppointment(appointmentId: string): void {
  const data = getData();
  const appointment = data.appointments.find(a => a.id === appointmentId);

  if (!appointment) {
    throw new Error('Appointment not found');
  }

  if (appointment.status === 'cancelled') {
    throw new Error('Appointment is already cancelled');
  }

  // Update appointment status
  appointment.status = 'cancelled';
  appointment.updatedAt = new Date().toISOString();
  writeData('appointments', data.appointments);

  // Free up the slot
  markSlotAsAvailable(appointment.slotId);
}

export function getUserAppointments(email: string): Appointment[] {
  const data = getData();
  return data.appointments.filter(
    a => a.clientEmail.toLowerCase() === email.toLowerCase()
  );
}

export function getAllAppointments(): Appointment[] {
  const data = getData();
  return data.appointments;
}

export function getAppointmentById(appointmentId: string): Appointment | null {
  const data = getData();
  return data.appointments.find(a => a.id === appointmentId) || null;
}
