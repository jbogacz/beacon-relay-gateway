import { NextRequest, NextResponse } from 'next/server';
import { BeaconEventSchema } from '@/schemas/beacon';
import { validateRequest, withErrorHandling } from '@/lib/apiHandler';
import { pubSubService } from '@/lib/pubSubClient';
import { pubSubConfig } from '@/lib/config';

interface BeaconEventResponse {
  eventId: string;
  processedAt: string;
  subjectId: string;
  beaconUuid: string;
  eventType: string;
  signalStrength: number;
  major: number;
  minor: number;
}

// POST handler using middleware for error handling
export const POST = withErrorHandling(async (req: NextRequest) => {
  // Validate request with error handling for invalid JSON and schema validation
  // If validation fails, an error is thrown and caught by the middleware
  const data = await validateRequest(req, BeaconEventSchema);

  // Generate a unique event ID (in a real app, this would likely come from a database)
  const eventId = `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  // Initialize PubSub service if not already done
  // In production, you would do this during app startup, not per request
  if (!pubSubService.isReady()) {
    pubSubService.initialize(pubSubConfig);
  }

  // Publish the event to the messaging system
  try {
    const messageId = await pubSubService.publishEvent(data);
    console.log(`Event published successfully with message ID: ${messageId}`);
  } catch (error) {
    console.error('Failed to publish event:', error);
    // We continue processing even if publishing fails
    // In a real application, you might want to implement retries or a dead letter queue
  }

  // Create a structured response
  const response: BeaconEventResponse = {
    eventId,
    processedAt: new Date().toISOString(),
    subjectId: data.subjectId,
    beaconUuid: data.beacon.uuid,
    eventType: data.type,
    signalStrength: data.beacon.signalStrength,
    major: data.beacon.major,
    minor: data.beacon.minor,
  };

  return NextResponse.json(
    {
      success: true,
      eventId,
      processedAt: response.processedAt,
      data: {
        subjectId: data.subjectId,
        beaconUuid: data.beacon.uuid,
        eventType: data.type,
        signalStrength: data.beacon.signalStrength,
        major: data.beacon.major,
        minor: data.beacon.minor,
      },
    },
    { status: 201 }
  );
});
