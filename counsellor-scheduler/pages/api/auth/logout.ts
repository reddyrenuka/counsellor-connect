import { NextApiRequest, NextApiResponse } from 'next';
import { destroySession } from '../../../utils/sessionManager';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await destroySession(req, res);
    res.status(200).json({ success: true, message: 'Logged out' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}
