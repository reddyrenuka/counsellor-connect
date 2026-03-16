import fs from 'fs';
import path from 'path';
import { User } from '../types/user';
import { Appointment } from '../types/appointment';
import { Slot } from '../types/slot';

interface DataStore {
  users: User[];
  appointments: Appointment[];
  slots: Slot[];
  config: { adminEmail: string };
}

// In-memory cache
let dataCache: DataStore | null = null;

const DATA_DIR = path.join(process.cwd(), 'data');

function getFilePath(type: keyof DataStore): string {
  return path.join(DATA_DIR, `${type}.json`);
}

export function loadData(): DataStore {
  if (dataCache) {
    return dataCache;
  }

  try {
    const users = JSON.parse(fs.readFileSync(getFilePath('users'), 'utf-8')) as User[];
    const appointments = JSON.parse(fs.readFileSync(getFilePath('appointments'), 'utf-8')) as Appointment[];
    const slots = JSON.parse(fs.readFileSync(getFilePath('slots'), 'utf-8')) as Slot[];
    const config = JSON.parse(fs.readFileSync(getFilePath('config'), 'utf-8')) as { adminEmail: string };

    dataCache = { users, appointments, slots, config };
    console.log('[FileLoader] Data loaded successfully from JSON files');
    return dataCache;
  } catch (error) {
    console.error('[FileLoader] Error loading data:', error);
    // Initialize with empty data if files don't exist
    dataCache = {
      users: [],
      appointments: [],
      slots: [],
      config: { adminEmail: process.env.ADMIN_EMAIL || 'counsellor@example.com' }
    };
    return dataCache;
  }
}

export function writeData<K extends keyof DataStore>(type: K, data: DataStore[K]): void {
  try {
    const filePath = getFilePath(type);
    const tempPath = `${filePath}.tmp`;

    // Atomic write: write to temp file, then rename
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempPath, filePath);

    // Update in-memory cache
    if (dataCache) {
      dataCache[type] = data;
    }

    console.log(`[FileLoader] ${type} data written successfully`);
  } catch (error) {
    console.error(`[FileLoader] Error writing ${type} data:`, error);
    throw error;
  }
}

export function getData(): DataStore {
  if (!dataCache) {
    return loadData();
  }
  return dataCache;
}
