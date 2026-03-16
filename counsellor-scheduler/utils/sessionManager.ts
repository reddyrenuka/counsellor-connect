import { getIronSession, IronSession, SessionOptions } from 'iron-session';
import { SessionData } from '../types/session';
import { NextApiRequest, NextApiResponse } from 'next';

const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET || 'complex_password_at_least_32_characters_long',
  cookieName: 'counsellor_session',
  ttl: 60 * 60 * 24, // 1 day in seconds
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
  },
};

export async function getSession(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<IronSession<SessionData>> {
  return getIronSession<SessionData>(req, res, sessionOptions);
}

export async function createSession(
  req: NextApiRequest,
  res: NextApiResponse,
  userData: SessionData['user']
): Promise<void> {
  const session = await getSession(req, res);
  session.user = userData;
  session.isAdmin = userData.role === 'admin';
  session.expiresAt = Date.now() + (24 * 60 * 60 * 1000); // 1 day from now
  await session.save();
}

export async function destroySession(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const session = await getSession(req, res);
  session.destroy();
}
