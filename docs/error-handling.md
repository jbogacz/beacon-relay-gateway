# API Error Handling in Beacon Relay Gateway

This document explains the standardized error handling approach used in the Beacon Relay Gateway API.

## Overview

The API uses a centralized error handling system that:

1. Provides consistent error responses across all API endpoints
2. Handles common error types automatically (validation errors, JSON parsing errors, etc.)
3. Makes route handlers cleaner by abstracting error handling logic
4. Simplifies adding new API endpoints with built-in error handling

## Error Response Format

All API errors follow this JSON structure:

```json
{
  "success": false,
  "message": "A human-readable error message",
  "code": "ERROR_CODE",
  "errors": [
    {
      "path": "field.name",
      "message": "Specific error about this field"
    }
  ],
  "timestamp": "2025-07-05T12:34:56.789Z"
}
```

- `success`: Always `false` for error responses
- `message`: A general error description
- `code`: Optional error code for programmatic handling
- `errors`: Optional array of specific validation errors (for form validation)
- `timestamp`: When the error occurred

## Success Response Format

Successful responses follow this structure:

```json
{
  "success": true,
  "data": {
    // Response data varies by endpoint
  },
  "message": "Optional success message",
  "timestamp": "2025-07-05T12:34:56.789Z"
}
```

## Implementation Details

### Core Files

- `lib/api-utils.ts`: Contains utility functions for API error handling
- `lib/middleware.ts`: Provides middleware to wrap route handlers with error handling

### Error Types Handled

1. **Validation Errors**: Uses Zod for request validation
2. **JSON Parsing Errors**: Catches and formats invalid JSON in request bodies
3. **General Errors**: Catches any unhandled errors in route handlers

### Usage

#### Option 1: Using the Middleware (Recommended)

```typescript
import { withErrorHandling } from '@/lib/middleware';
import { validateRequest } from '@/lib/api-utils';
import { UserSchema } from '@/schemas/user';

export const POST = withErrorHandling(async (req) => {
  // Validation will throw errors that are caught by middleware
  const data = await validateRequest(req, UserSchema);

  // Rest of handler code - no try/catch needed
  return NextResponse.json({
    success: true,
    data: {
      /* ... */
    },
  });
});
```

#### Option 2: Direct Error Handling

```typescript
import { handleApiError, validateRequest } from '@/lib/api-utils';
import { UserSchema } from '@/schemas/user';

export async function POST(req) {
  try {
    const data = await validateRequest(req, UserSchema);

    return NextResponse.json({
      success: true,
      data: {
        /* ... */
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
```

## Testing Error Handling

### Testing in the Browser or API Client

You can test the error handling using any API client (like Postman, Insomnia, or curl):

1. **Invalid JSON**: Send a malformed JSON body to test JSON parsing errors

   ```bash
   curl -X POST http://localhost:3000/api/users \
     -H "Content-Type: application/json" \
     -d '{"name": "John", "email": "invalid-json'
   ```

2. **Validation Errors**: Send data that fails schema validation

   ```bash
   curl -X POST http://localhost:3000/api/users \
     -H "Content-Type: application/json" \
     -d '{"name": "", "email": "not-an-email"}'
   ```

3. **Simulate Different Error Types**: Use query parameters with the `/api/users` endpoint:
   - Generic error: `?error=true`
   - Not found error: `?errorType=notFound&id=123`
   - Forbidden error: `?errorType=forbidden`
   - Rate limit error: `?errorType=rateLimit`

### Example Response for Each Error Type

#### Invalid JSON (400 Bad Request)

```json
{
  "success": false,
  "message": "Invalid JSON in request body",
  "code": "INVALID_JSON",
  "timestamp": "2025-07-05T12:34:56.789Z"
}
```

#### Validation Error (400 Bad Request)

```json
{
  "success": false,
  "message": "Validation error occurred",
  "errors": [
    {
      "path": "name",
      "message": "Name is required"
    },
    {
      "path": "email",
      "message": "Invalid email format"
    }
  ],
  "code": "VALIDATION_ERROR",
  "timestamp": "2025-07-05T12:34:56.789Z"
}
```

#### Not Found Error (404 Not Found)

```json
{
  "success": false,
  "message": "User with id 123 not found",
  "code": "NOT_FOUND",
  "timestamp": "2025-07-05T12:34:56.789Z"
}
```

#### Forbidden Error (403 Forbidden)

```json
{
  "success": false,
  "message": "You do not have permission to access these users",
  "code": "FORBIDDEN",
  "timestamp": "2025-07-05T12:34:56.789Z"
}
```

## How the Middleware Works

### Function-Based Approach vs. Next.js Middleware

Our error handling uses a function-based approach rather than Next.js's built-in middleware system.

#### Our Approach (Function Wrapping)

Unlike Next.js's built-in middleware (which runs before matching routes), our `withErrorHandling` middleware uses a higher-order function pattern:

1. **Function Wrapping**: When you write `export const POST = withErrorHandling(async (req) => {...})`, you're wrapping your handler function with another function.

2. **Request Flow**:

   ```
   Client Request → Next.js → withErrorHandling → Your Handler Function → Response
                                     ↓
                          (If error) → Error Handler → Error Response
   ```

3. **Under the Hood**: Here's what's happening in the middleware:

   ```typescript
   // In lib/middleware.ts
   export function withErrorHandling(handler) {
     // Return a new function that will become the actual route handler
     return async function (req) {
       try {
         // Call the original handler you provided
         return await handler(req);
       } catch (error) {
         // If any error occurs, handle it with our centralized handler
         return handleApiError(error);
       }
     };
   }
   ```

4. **No Configuration Required**: You don't need to set up any global configuration - just wrap each handler with `withErrorHandling`.

This approach provides flexibility (you can choose which handlers to wrap) while keeping your route handlers clean and focused on business logic.

#### Alternative: Next.js Middleware (Not Used in This Project)

Next.js also provides a built-in middleware system that runs before routes are matched:

```typescript
// middleware.ts at the project root (not our current implementation)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  try {
    // Process request
    return NextResponse.next();
  } catch (error) {
    // Handle error
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Configure which routes use this middleware
export const config = {
  matcher: '/api/:path*',
};
```

We chose the function wrapping approach because:

1. It gives more granular control over which handlers use error handling
2. It can access the specific handler's context
3. It lets different API routes use different error handling if needed
4. It's more explicit - you can see which routes have error handling at a glance

## Extending Error Handling

### Adding Custom Error Types

To add new error types, first create a custom error class:

```typescript
// lib/errors.ts
export class NotFoundError extends Error {
  constructor(resource: string, id?: string) {
    const message = id ? `${resource} with id ${id} not found` : `${resource} not found`;
    super(message);
    this.name = 'NotFoundError';
  }
}

export class ForbiddenError extends Error {
  constructor(message = 'Access denied') {
    super(message);
    this.name = 'ForbiddenError';
  }
}
```

Then update the `handleApiError` function in `lib/api-utils.ts` to handle these errors:

```typescript
import { NotFoundError, ForbiddenError } from './errors';

export function handleApiError(error: unknown, statusCode = 500): NextResponse<ApiError> {
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
  } else if (error instanceof Error) {
    errorResponse.message = error.message;
  }

  return NextResponse.json(errorResponse, { status: statusCode });
}
```

### Using Custom Errors in Route Handlers

```typescript
import { NotFoundError } from '@/lib/errors';

export const GET = withErrorHandling(async (req) => {
  const id = new URL(req.url).searchParams.get('id');

  const user = await db.users.findById(id);

  if (!user) {
    // This error will be caught by the middleware
    // and converted to a proper 404 response
    throw new NotFoundError('User', id);
  }

  return NextResponse.json({
    success: true,
    data: user,
  });
});
```
