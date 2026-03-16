import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '../../../utils/sessionManager';
import { sendError } from '../../../utils/errorHandler';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const session = await getSession(req, res);

    if (!session.user) {
      return sendError(res, 401, 'Not authenticated', 'UNAUTHORIZED');
    }

    res.status(200).json({
      user: session.user,
      isAdmin: session.isAdmin,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}
