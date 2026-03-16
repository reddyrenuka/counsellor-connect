import { Slot } from '../types/slot';
import { getData, writeData } from '../utils/fileLoader';
import { generateId } from '../utils/idGenerator';

export function getAvailableSlots(date: string): Slot[] {
  const data = getData();
  return data.slots.filter(slot => slot.date === date && slot.status === 'available');
}

export function getAllSlots(): Slot[] {
  const data = getData();
  return data.slots;
}

export function createSlot(date: string, time: string): Slot {
  const data = getData();

  // Check if slot already exists
  const existing = data.slots.find(s => s.date === date && s.time === time);
  if (existing) {
    throw new Error('Slot already exists for this date and time');
  }

  const newSlot: Slot = {
    slotId: generateId(),
    date,
    time,
    status: 'available',
    createdAt: new Date().toISOString(),
  };

  data.slots.push(newSlot);
  writeData('slots', data.slots);

  return newSlot;
}

export function removeSlot(slotId: string): void {
  const data = getData();
  const slotIndex = data.slots.findIndex(s => s.slotId === slotId);

  if (slotIndex === -1) {
    throw new Error('Slot not found');
  }

  // Check if slot is booked
  const slot = data.slots[slotIndex];
  if (slot.status === 'booked') {
    throw new Error('Cannot remove a booked slot');
  }

  data.slots.splice(slotIndex, 1);
  writeData('slots', data.slots);
}

export function markSlotAsBooked(slotId: string): void {
  const data = getData();
  const slot = data.slots.find(s => s.slotId === slotId);

  if (!slot) {
    throw new Error('Slot not found');
  }

  if (slot.status === 'booked') {
    throw new Error('Slot is already booked');
  }

  slot.status = 'booked';
  writeData('slots', data.slots);
}

export function markSlotAsAvailable(slotId: string): void {
  const data = getData();
  const slot = data.slots.find(s => s.slotId === slotId);

  if (!slot) {
    throw new Error('Slot not found');
  }

  slot.status = 'available';
  writeData('slots', data.slots);
}
