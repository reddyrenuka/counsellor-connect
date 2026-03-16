import { NextApiRequest, NextApiResponse } from 'next';
import { bookAppointment } from '../../../services/appointmentService';
import { requireAuth } from '../../../utils/authMiddleware';
import { getSession } from '../../../utils/sessionManager';
import { bookAppointmentSchema } from '../../../utils/validation';
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
    const validation = bookAppointmentSchema.safeParse(req.body);
    if (!validation.success) {
      return sendError(res, 400, validation.error.issues[0].message, 'VALIDATION_ERROR');
    }

    const { slotId, topic, date, time } = validation.data;

    // Get user from session
    const session = await getSession(req, res);
    const { email, name } = session.user!;

    // Book appointment
    const appointment = bookAppointment(email, name, slotId, topic, date, time);

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      appointment,
    });
  } catch (error) {
    handleError(res, error);
  }
}
