import { NextApiRequest, NextApiResponse } from 'next';
import { getAllAppointments, getUserAppointments } from '../../../services/appointmentService';
import { requireAuth } from '../../../utils/authMiddleware';
import { getSession } from '../../../utils/sessionManager';
import { handleError } from '../../../utils/errorHandler';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check authentication
  const isAuthorized = await requireAuth(req, res);
  if (!isAuthorized) {
    return; // Error already sent by middleware
  }

  try {
    const session = await getSession(req, res);
    const user = session.user!;

    let appointments;

    if (session.isAdmin) {
      // Admin sees all appointments
      appointments = getAllAppointments();
    } else {
      // Client sees only their appointments
      appointments = getUserAppointments(user.email);
    }

    res.status(200).json({
      success: true,
      appointments,
    });
  } catch (error) {
    handleError(res, error);
  }
}
