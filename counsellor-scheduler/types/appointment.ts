export interface Appointment {
  id: string;
  clientEmail: string;
  clientName: string;
  slotId: string;
  date: string; // ISO date string in UTC
  time: string; // HH:mm format in UTC
  topic: string;
  status: 'confirmed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}
