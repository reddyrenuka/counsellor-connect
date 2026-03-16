import { NextApiRequest, NextApiResponse } from 'next';
import { createSlot, removeSlot, getAllSlots } from '../../../services/slotService';
import { requireAdmin } from '../../../utils/authMiddleware';
import { createSlotSchema, removeSlotSchema } from '../../../utils/validation';
import { handleError, sendError } from '../../../utils/errorHandler';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check admin authorization
  const isAuthorized = await requireAdmin(req, res);
  if (!isAuthorized) {
    return; // Error already sent by middleware
  }

  try {
    if (req.method === 'GET') {
      // Get all slots
      const slots = getAllSlots();
      return res.status(200).json({ success: true, slots });
    }

    if (req.method === 'POST') {
      const { operation } = req.body;

      if (operation === 'create') {
        // Validate input
        const validation = createSlotSchema.safeParse(req.body);
        if (!validation.success) {
          return sendError(res, 400, validation.error.issues[0].message, 'VALIDATION_ERROR');
        }

        const { date, time } = validation.data;
        const slot = createSlot(date, time);

        return res.status(201).json({
          success: true,
          message: 'Slot created successfully',
          slot,
        });
      }

      if (operation === 'remove') {
        // Validate input
        const validation = removeSlotSchema.safeParse(req.body);
        if (!validation.success) {
          return sendError(res, 400, validation.error.issues[0].message, 'VALIDATION_ERROR');
        }

        const { slotId } = validation.data;
        removeSlot(slotId);

        return res.status(200).json({
          success: true,
          message: 'Slot removed successfully',
        });
      }

      return sendError(res, 400, 'Invalid operation. Use "create" or "remove"', 'INVALID_OPERATION');
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    handleError(res, error);
  }
}
