import { NextApiResponse } from 'next';

export interface ErrorResponse {
  error: string;
  code: string;
  statusCode: number;
}

export function sendError(
  res: NextApiResponse,
  statusCode: number,
  message: string,
  code: string
): void {
  res.status(statusCode).json({
    error: message,
    code,
    statusCode,
  });
}

export function handleError(res: NextApiResponse, error: unknown): void {
  console.error('[API Error]:', error);

  if (error instanceof Error) {
    // Handle known errors
    if (error.message.includes('already booked')) {
      return sendError(res, 409, error.message, 'SLOT_ALREADY_BOOKED');
    }
    if (error.message.includes('not found')) {
      return sendError(res, 404, error.message, 'RESOURCE_NOT_FOUND');
    }
    if (error.message.includes('already exists')) {
      return sendError(res, 409, error.message, 'RESOURCE_ALREADY_EXISTS');
    }
    
    // Generic error
    return sendError(res, 500, 'An unexpected error occurred', 'INTERNAL_ERROR');
  }

  sendError(res, 500, 'An unexpected error occurred', 'UNKNOWN_ERROR');
}
