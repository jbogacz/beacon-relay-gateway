import { NextRequest, NextResponse } from 'next/server';
import { handleApiError } from './api-utils';

/**
 * API Middleware function that can be used to wrap API route handlers
 * for consistent error handling and logging
 */
export function withErrorHandling(handler: (req: NextRequest) => Promise<NextResponse> | NextResponse) {
  return async function (req: NextRequest): Promise<NextResponse> {
    try {
      // Add request logging if needed
      // console.log(`${req.method} ${req.url}`)

      // Call the original handler
      return await handler(req);
    } catch (error) {
      // Use the centralized error handler
      return handleApiError(error);
    }
  };
}

/**
 * Example usage:
 *
 * import { withErrorHandling } from '@/lib/middleware'
 *
 * export const POST = withErrorHandling(async (req) => {
 *   // Your handler code here
 *   // No need for try/catch blocks - errors will be handled by the middleware
 * })
 */
