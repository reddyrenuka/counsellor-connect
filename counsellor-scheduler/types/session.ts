export interface SessionData {
  user: {
    id: string;
    email: string;
    name: string;
    role: 'client' | 'admin';
  };
  isAdmin: boolean;
  expiresAt: number;
}
