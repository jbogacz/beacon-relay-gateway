import { NextRequest, NextResponse } from 'next/server';
import { ZodError, ZodSchema } from 'zod';
import { NotFoundError, ForbiddenError, ConflictError, RateLimitError, ServiceUnavailableError } from './errors';

export interface ApiError {
  success: false;
  message: string;
  errors?: Array<{
    path: string;
    message: string;
  }>;
  code?: string;
  timestamp: string;
}

export interface ApiSuccess<T> {
  success: true;
  data?: T;
  message?: string;
  timestamp: string;
}

export type ApiResponse<T = unknown> = ApiSuccess<T> | ApiError;

/**
 * Generic error handler for API routes
 */
export function handleApiError(error: unknown, statusCode = 500): NextResponse<ApiError> {
  console.error('API Error:', error);

  // Default error response
  const errorResponse: ApiError = {
    success: false,
    message: 'An unexpected error occurred',
    timestamp: new Date().toISOString(),
  };

  // Handle specific error types
  if (error instanceof ZodError) {
    return handleZodError(error);
  } else if (error instanceof SyntaxError && error.message.includes('JSON')) {
    // Handle JSON parsing errors
    errorResponse.message = 'Invalid JSON in request body';
    errorResponse.code = 'INVALID_JSON';
    return NextResponse.json(errorResponse, { status: 400 });
  } else if (error instanceof NotFoundError) {
    errorResponse.message = error.message;
    errorResponse.code = 'NOT_FOUND';
    return NextResponse.json(errorResponse, { status: 404 });
  } else if (error instanceof ForbiddenError) {
    errorResponse.message = error.message;
    errorResponse.code = 'FORBIDDEN';
    return NextResponse.json(errorResponse, { status: 403 });
  } else if (error instanceof ConflictError) {
    errorResponse.message = error.message;
    errorResponse.code = 'CONFLICT';
    return NextResponse.json(errorResponse, { status: 409 });
  } else if (error instanceof RateLimitError) {
    errorResponse.message = error.message;
    errorResponse.code = 'RATE_LIMIT_EXCEEDED';
    return NextResponse.json(errorResponse, { status: 429 });
  } else if (error instanceof ServiceUnavailableError) {
    errorResponse.message = error.message;
    errorResponse.code = 'SERVICE_UNAVAILABLE';
    return NextResponse.json(errorResponse, { status: 503 });
  } else if (error instanceof Error) {
    errorResponse.message = error.message;
  }

  return NextResponse.json(errorResponse, { status: statusCode });
}

/**
 * Specialized handler for Zod validation errors
 */
export function handleZodError(error: ZodError): NextResponse<ApiError> {
  const errorResponse: ApiError = {
    success: false,
    message: 'Validation error occurred',
    errors: error.issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message,
    })),
    code: 'VALIDATION_ERROR',
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(errorResponse, { status: 400 });
}

/**
 * Safely parse JSON from a request with error handling
 */
export async function safeParseJson<T>(req: NextRequest): Promise<T> {
  try {
    return (await req.json()) as T;
  } catch (error) {
    throw new SyntaxError('Invalid JSON in request body');
  }
}

/**
 * Safely validate request body with a Zod schema
 */
export async function validateRequest<T>(req: NextRequest, schema: ZodSchema<T>): Promise<T> {
  // Parse JSON safely
  const body = await safeParseJson(req);

  // Validate with Zod schema
  const result = schema.safeParse(body);

  if (!result.success) {
    throw result.error;
  }

  return result.data;
}

/**
 * Create a success response
 */
export function createSuccessResponse<T>(data?: T, message?: string): NextResponse<ApiSuccess<T>> {
  const response: ApiSuccess<T> = {
    success: true,
    timestamp: new Date().toISOString(),
  };

  if (data !== undefined) {
    response.data = data;
  }

  if (message) {
    response.message = message;
  }

  return NextResponse.json(response);
}
