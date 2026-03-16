import { NextApiRequest, NextApiResponse } from 'next';
import { loginAsAdmin } from '../../../services/authService';
import { createSession } from '../../../utils/sessionManager';
import { adminLoginSchema } from '../../../utils/validation';
import { handleError, sendError } from '../../../utils/errorHandler';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Validate input
    const validation = adminLoginSchema.safeParse(req.body);
    if (!validation.success) {
      return sendError(res, 400, validation.error.issues[0].message, 'VALIDATION_ERROR');
    }

    const { email, password } = validation.data;

    // Login as admin
    const user = loginAsAdmin(email, password);

    if (!user) {
      return sendError(res, 401, 'Invalid email or password', 'INVALID_CREDENTIALS');
    }

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
