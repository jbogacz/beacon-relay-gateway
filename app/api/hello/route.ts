import { createValidationMiddleware } from '@/lib/validation';
import {
  HelloRequestSchema,
  HelloResponse
} from '@/schemas/hello';
import { NextRequest, NextResponse } from 'next/server';

const validateRequest = createValidationMiddleware(HelloRequestSchema);

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const name = url.searchParams.get('name');

  const response: HelloResponse = {
    message: name ? `Hello, ${name}!` : 'Hello, World!',
    timestamp: new Date().toISOString()
  };

  return NextResponse.json(response);
}

export async function POST(request: NextRequest) {
  try {
    // Validate request body against schema
    const validation = await validateRequest(request);
    if (!validation.isValid) {
      return validation.errorResponse!
    }

    console.log('Received request body:', validation.data);

    // Generate the response
    const response: HelloResponse = {
      message: validation.data?.name
        ? `Hello, ${validation.data.name}!`
        : 'Hello, World!',
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { message: 'Internal server error', code: 'SERVER_ERROR' },
      { status: 500 }
    );
  }
}
