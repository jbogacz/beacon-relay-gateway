import { z } from 'zod'
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'

extendZodWithOpenApi(z)

export const BeaconDataSchema = z
  .object({
    major: z.number().int().min(0).max(65535).openapi({
      description: 'Beacon major identifier (0–65535)',
      example: 1234,
    }),
    minor: z.number().int().min(0).max(65535).openapi({
      description: 'Beacon minor identifier (0–65535)',
      example: 5678,
    }),
    signalStrength: z.number().openapi({
      description: 'Signal strength in dBm (typically negative)',
      example: -78,
    }),
    timestamp: z.string().datetime().openapi({
      description: 'Timestamp when beacon was detected (ISO 8601)',
      example: '2025-07-04T12:00:00Z',
    }),
    uuid: z.string().uuid().openapi({
      description: 'Beacon UUID in standard format',
      example: 'e2c56db5-dffb-48d2-b060-d0f5a71096e0',
    }),
  })
  .openapi({ title: 'BeaconData' })

export const BeaconEventSchema = z
  .object({
    timestamp: z.string().datetime().openapi({
      description: 'Timestamp of the event (ISO 8601)',
      example: '2025-07-04T12:00:00Z',
    }),
    subjectId: z.string().min(1).openapi({
      description: 'Identifier for the subject (user, device, etc.)',
      example: 'user-123',
    }),
    eventId: z.string().min(1).openapi({
      description: 'Unique identifier for this event in UUID format',
      example: 'e5f8c868-7de8-4a83-b193-46d446ac7fd8',
    }),
    beacon: BeaconDataSchema,
    type: z.enum(['ENTER', 'EXIT']).openapi({
      description: 'Type of beacon event',
      example: 'ENTER',
    }),
  })
  .openapi({ title: 'BeaconEvent' })

export const BeaconEventResponseSchema = z
  .object({
    success: z.boolean().openapi({ example: true }),
    messageID: z.string().optional().openapi({
      description: 'ID of the processed event',
      example: 'event-abc',
    }),
    processedAt: z.string().datetime().openapi({
      description: 'Timestamp when the event was processed',
      example: '2025-07-04T12:01:00Z',
    }),
    error: z.string().optional().openapi({
      description: 'Error message if the request failed',
    }),
  })
  .openapi({ title: 'BeaconEventResponse' })
