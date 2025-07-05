import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandling } from '@/lib/middleware';
import { safeParseJson } from '@/lib/api-utils';
import { z } from 'zod';
import { NotFoundError, ForbiddenError, RateLimitError } from '@/lib/errors';

// Define a schema for user data
const UserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  role: z.enum(['admin', 'user', 'guest']).optional().default('user'),
});

type User = z.infer<typeof UserSchema>;

// Sample user data
const users = [
  { id: 'user_1', name: 'Philip', email: 'philip@example.com', active: true, role: 'admin' },
  { id: 'user_2', name: 'Bob', email: 'bob@example.com', active: false, role: 'user' },
  { id: 'user_3', name: 'Charlie', email: 'charlie@example.com', active: true, role: 'user' },
];

// GET handler wrapped in error handling middleware
export const GET = withErrorHandling(async (req: NextRequest) => {
  // Query parameter handling example
  const url = new URL(req.url);
  const activeOnly = url.searchParams.get('active') === 'true';

  // Filter users if needed
  const filteredUsers = activeOnly ? users.filter((user) => user.active) : users;

  // Simulate potential errors (for testing)
  if (url.searchParams.get('error') === 'true') {
    throw new Error('Simulated generic error');
  }

  // Demonstrate custom error types
  const errorType = url.searchParams.get('errorType');
  if (errorType === 'notFound') {
    throw new NotFoundError('User', url.searchParams.get('id') || 'unknown');
  } else if (errorType === 'forbidden') {
    throw new ForbiddenError('You do not have permission to access these users');
  } else if (errorType === 'rateLimit') {
    throw new RateLimitError();
  }

  // ES2023 methods
  const sortedUsers = filteredUsers.toSorted((a, b) => a.name.localeCompare(b.name));
  const lastActiveUser = filteredUsers.findLast((user) => user.active);

  return NextResponse.json({
    success: true,
    data: {
      users: sortedUsers,
      lastActive: lastActiveUser,
      count: filteredUsers.length,
    },
    timestamp: new Date().toISOString(),
  });
});

// POST handler for creating users
export const POST = withErrorHandling(async (req: NextRequest) => {
  // Parse JSON (if this fails, middleware will catch and format the error)
  const body = await safeParseJson<unknown>(req);

  // Validate against schema (throws ZodError if invalid)
  const userData = UserSchema.parse(body);

  // Generate a user ID
  const userId = `user_${Date.now()}`;

  // Example response
  return NextResponse.json(
    {
      success: true,
      message: 'User created successfully',
      data: {
        id: userId,
        ...userData,
        active: true,
        createdAt: new Date().toISOString(),
      },
    },
    { status: 201 }
  );
});
