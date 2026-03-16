import { User } from '../types/user';
import { getData, writeData } from '../utils/fileLoader';
import { generateId } from '../utils/idGenerator';

export function loginAsGuest(name: string, email: string): User {
  const data = getData();
  
  // Check if user already exists
  const existingUser = data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existingUser) {
    return existingUser;
  }

  // Create new guest user
  const newUser: User = {
    id: generateId(),
    name,
    email: email.toLowerCase(),
    role: 'client',
    createdAt: new Date().toISOString(),
  };

  data.users.push(newUser);
  writeData('users', data.users);

  return newUser;
}

export function loginAsAdmin(email: string, password: string): User | null {
  const adminEmail = process.env.ADMIN_EMAIL || 'counsellor@example.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

  if (email.toLowerCase() !== adminEmail.toLowerCase() || password !== adminPassword) {
    return null;
  }

  const data = getData();
  
  // Check if admin user exists
  let adminUser = data.users.find(u => u.email.toLowerCase() === adminEmail.toLowerCase());
  
  if (!adminUser) {
    // Create admin user
    adminUser = {
      id: generateId(),
      name: 'Counsellor Admin',
      email: adminEmail.toLowerCase(),
      role: 'admin',
      createdAt: new Date().toISOString(),
    };
    data.users.push(adminUser);
    writeData('users', data.users);
  }

  return adminUser;
}
