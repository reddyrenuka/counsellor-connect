import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from './sessionManager';
import { sendError } from './errorHandler';

export async function requireAuth(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<boolean> {
  const session = await getSession(req, res);

  if (!session.user) {
    sendError(res, 401, 'Unauthorized - Please log in', 'UNAUTHORIZED');
    return false;
  }

  return true;
}

export async function requireAdmin(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<boolean> {
  const session = await getSession(req, res);

  if (!session.user) {
    sendError(res, 401, 'Unauthorized - Please log in', 'UNAUTHORIZED');
    return false;
  }

  if (!session.isAdmin) {
    sendError(res, 403, 'Forbidden - Admin access required', 'FORBIDDEN');
    return false;
  }

  return true;
}
