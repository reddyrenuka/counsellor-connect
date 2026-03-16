export interface Slot {
  slotId: string;
  date: string; // ISO date string in UTC
  time: string; // HH:mm format in UTC
  status: 'available' | 'booked';
  createdAt: string;
}
