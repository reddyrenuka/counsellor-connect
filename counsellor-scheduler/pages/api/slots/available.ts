import { NextApiRequest, NextApiResponse } from 'next';
import { getAvailableSlots } from '../../../services/slotService';
import { handleError, sendError } from '../../../utils/errorHandler';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { date } = req.query;

    if (!date || typeof date !== 'string') {
      return sendError(res, 400, 'Date parameter is required', 'MISSING_PARAMETER');
    }

    // Validate date format (YYYY-MM-DD)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return sendError(res, 400, 'Invalid date format. Use YYYY-MM-DD', 'INVALID_FORMAT');
    }

    const slots = getAvailableSlots(date);

    res.status(200).json({
      success: true,
      date,
      slots,
    });
  } catch (error) {
    handleError(res, error);
  }
}
