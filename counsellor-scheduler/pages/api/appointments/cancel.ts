import { NextApiRequest, NextApiResponse } from 'next';
import { cancelAppointment, getAppointmentById } from '../../../services/appointmentService';
import { requireAuth } from '../../../utils/authMiddleware';
import { getSession } from '../../../utils/sessionManager';
import { cancelAppointmentSchema } from '../../../utils/validation';
import { handleError, sendError } from '../../../utils/errorHandler';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check authentication
  const isAuthorized = await requireAuth(req, res);
  if (!isAuthorized) {
    return; // Error already sent by middleware
  }

  try {
    // Validate input
    const validation = cancelAppointmentSchema.safeParse(req.body);
    if (!validation.success) {
      return sendError(res, 400, validation.error.issues[0].message, 'VALIDATION_ERROR');
    }

    const { appointmentId } = validation.data;

    // Get user from session
    const session = await getSession(req, res);
    const user = session.user!;

    // Verify ownership (unless admin)
    const appointment = getAppointmentById(appointmentId);
    if (!appointment) {
      return sendError(res, 404, 'Appointment not found', 'NOT_FOUND');
    }

    if (!session.isAdmin && appointment.clientEmail !== user.email) {
      return sendError(res, 403, 'You can only cancel your own appointments', 'FORBIDDEN');
    }

    // Cancel appointment
    cancelAppointment(appointmentId);

    res.status(200).json({
      success: true,
      message: 'Appointment cancelled successfully',
    });
  } catch (error) {
    handleError(res, error);
  }
}
