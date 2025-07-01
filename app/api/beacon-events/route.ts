// app/api/beacon-events/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { BeaconEventSchema, type BeaconEvent, type BeaconEventResponse } from '@/schemas/beacon';
import { createValidationMiddleware } from '@/lib/validation';

// Create validation middleware for beacon events
const validateBeaconEvent = createValidationMiddleware(BeaconEventSchema);

export async function POST(request: NextRequest): Promise<NextResponse<BeaconEventResponse | unknown>> {
  try {
    // Validate the request payload
    const validation = await validateBeaconEvent(request);

    if (!validation.isValid) {
      return validation.errorResponse!;
    }

    const event = validation.data!;

    console.log('Received valid beacon event:', {
      subjectId: event.subjectId,
      eventType: event.type,
      beaconUuid: event.beacon.uuid,
      timestamp: event.timestamp,
    });

    // Process the beacon event
    const result = await processBeaconEvent(event);

    // Successful response
    const response: BeaconEventResponse = {
      success: true,
      eventId: result.eventId,
      message: `Beacon ${event.type} event processed successfully`,
      processedAt: new Date().toISOString(),
      data: {
        subjectId: event.subjectId,
        beaconUuid: event.beacon.uuid,
        eventType: event.type,
        signalStrength: event.beacon.signalStrength,
        major: event.beacon.major,
        minor: event.beacon.minor,
      },
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error processing beacon event:', error);

    const errorResponse: BeaconEventResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
      processedAt: new Date().toISOString(),
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// Process the beacon event (replace with your business logic)
async function processBeaconEvent(event: BeaconEvent): Promise<{ eventId: string }> {
  // Generate a unique event ID
  const eventId = `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  console.log(`Processing ${event.type} event for subject ${event.subjectId}:`, {
    eventId,
    beaconUuid: event.beacon.uuid,
    major: event.beacon.major,
    minor: event.beacon.minor,
    signalStrength: event.beacon.signalStrength,
    timestamp: event.timestamp,
  });

  // Process based on event type
  switch (event.type) {
    case 'ENTER':
      await handleEnterEvent(event, eventId);
      break;
    case 'EXIT':
      await handleExitEvent(event, eventId);
      break;
  }

  // Simulate async processing
  await new Promise(resolve => setTimeout(resolve, 100));

  return { eventId };
}

// Business logic handlers
async function handleEnterEvent(event: BeaconEvent, eventId: string): Promise<void> {
  console.log(`Subject ${event.subjectId} entered beacon zone:`, {
    eventId,
    beaconId: `${event.beacon.major}:${event.beacon.minor}`,
    uuid: event.beacon.uuid,
    signalStrength: event.beacon.signalStrength,
    estimatedDistance: estimateDistance(event.beacon.signalStrength),
  });

  // Example business logic for ENTER event:
  // - Record entry time in database
  // - Trigger welcome notification
  // - Update location tracking
  // - Start proximity session
  // - Log analytics event
}

async function handleExitEvent(event: BeaconEvent, eventId: string): Promise<void> {
  console.log(`Subject ${event.subjectId} exited beacon zone:`, {
    eventId,
    beaconId: `${event.beacon.major}:${event.beacon.minor}`,
    uuid: event.beacon.uuid,
  });

  // Example business logic for EXIT event:
  // - Record exit time in database
  // - Calculate dwell time
  // - Trigger goodbye notification
  // - End proximity session
  // - Update analytics
}

async function handleRangeUpdateEvent(event: BeaconEvent, eventId: string): Promise<void> {
  const distance = estimateDistance(event.beacon.signalStrength);

  console.log(`Range update for subject ${event.subjectId}:`, {
    eventId,
    beaconId: `${event.beacon.major}:${event.beacon.minor}`,
    signalStrength: event.beacon.signalStrength,
    estimatedDistance: distance,
  });

  // Example business logic for RANGE_UPDATE event:
  // - Update proximity data in database
  // - Trigger distance-based actions
  // - Update real-time tracking
  // - Send proximity notifications based on distance
}

// Utility function to estimate distance from signal strength
function estimateDistance(rssi: number): string {
  // Simple distance estimation based on RSSI
  // Note: Real-world distance estimation requires beacon calibration
  if (rssi > -50) return 'immediate (< 1m)';
  if (rssi > -70) return 'near (1-3m)';
  if (rssi > -90) return 'far (3-10m)';
  return 'very far (> 10m)';
}

// Optional: GET method to return schema documentation
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    endpoint: '/api/beacon-events',
    method: 'POST',
    description: 'Process beacon proximity events (ENTER, EXIT, RANGE_UPDATE)',
    schema: BeaconEventSchema,
    examples: [
      {
        timestamp: '2025-06-28T06:40:05.703Z',
        subjectId: 'default_subject',
        id: '1',
        beacon: {
          major: 666,
          minor: 0,
          signalStrength: -87,
          timestamp: '2025-06-28T06:40:05.702Z',
          uuid: 'e2c56db5-dffb-48d2-b060-d0f5a71096e0',
        },
        type: 'ENTER',
      },
    ],
  });
}
