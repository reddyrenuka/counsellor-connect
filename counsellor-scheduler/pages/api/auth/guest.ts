import { NextApiRequest, NextApiResponse } from 'next';
import { loginAsGuest } from '../../../services/authService';
import { createSession } from '../../../utils/sessionManager';
import { guestLoginSchema } from '../../../utils/validation';
import { handleError, sendError } from '../../../utils/errorHandler';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Validate input
    const validation = guestLoginSchema.safeParse(req.body);
    if (!validation.success) {
      return sendError(res, 400, validation.error.issues[0].message, 'VALIDATION_ERROR');
    }

    const { name, email } = validation.data;

    // Login as guest
    const user = loginAsGuest(name, email);

    // Create session
    await createSession(req, res, user);

    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    handleError(res, error);
  }
}
