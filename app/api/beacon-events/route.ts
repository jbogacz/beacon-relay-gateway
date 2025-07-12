import { BeaconEvent, BeaconEventResponse } from '@/app/types/beacon';
import { validateRequest, withErrorHandling } from '@/lib/apiHandler';
import { pubSubClient } from '@/lib/pubSubClient';
import { BeaconEventSchema } from '@/schemas/beacon';
import { NextRequest, NextResponse } from 'next/server';

export const POST = withErrorHandling(async (req: NextRequest) => {
  const data: BeaconEvent = await validateRequest(req, BeaconEventSchema);

  try {
    const messageId = await pubSubClient.publishEvent(data);
    const response: BeaconEventResponse = {
      success: true,
      messageID: messageId,
      processedAt: new Date().toISOString(),
    };
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Failed to publish event:', error);
    const errorResponse: BeaconEventResponse = {
      success: false,
      messageID: undefined,
      error: error instanceof Error ? error.message : 'Unknown error',
      processedAt: new Date().toISOString(),
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
});
