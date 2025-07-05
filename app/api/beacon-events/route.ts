import { NextRequest, NextResponse } from 'next/server'
import { BeaconEventSchema } from '@/schemas/beacon'

export async function POST(req: NextRequest) {
  const body = await req.json()

  const result = BeaconEventSchema.safeParse(body)

  if (!result.success) {
    return NextResponse.json(
      {
        success: false,
        error: 'Validation failed',
        validationErrors: result.error.format(),
        processedAt: new Date().toISOString(),
      },
      { status: 400 }
    )
  }

  const data = result.data

  // proceed with validated `data`
  return NextResponse.json({
    success: true,
    eventId: 'event-123',
    processedAt: new Date().toISOString(),
    data: {
      subjectId: data.subjectId,
      beaconUuid: data.beacon.uuid,
      eventType: data.type,
      signalStrength: data.beacon.signalStrength,
      major: data.beacon.major,
      minor: data.beacon.minor,
    },
  })
}
