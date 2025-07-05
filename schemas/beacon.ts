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
    id: z.string().min(1).openapi({
      description: 'Unique identifier for this event',
      example: 'event-abc',
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
    eventId: z.string().optional().openapi({
      description: 'ID of the processed event',
      example: 'event-abc',
    }),
    message: z.string().optional().openapi({
      description: 'Optional message about the result',
      example: 'Event successfully processed',
    }),
    processedAt: z.string().datetime().openapi({
      description: 'Timestamp when the event was processed',
      example: '2025-07-04T12:01:00Z',
    }),
    data: z
      .object({
        subjectId: z.string().openapi({ example: 'user-123' }),
        beaconUuid: z.string().openapi({ example: 'e2c56db5-dffb-48d2-b060-d0f5a71096e0' }),
        eventType: z.string().openapi({ example: 'ENTER' }),
        signalStrength: z.number().openapi({ example: -78 }),
        major: z.number().int().openapi({ example: 1234 }),
        minor: z.number().int().openapi({ example: 5678 }),
      })
      .optional()
      .openapi({ description: 'Event metadata if successful' }),
    error: z.string().optional().openapi({
      description: 'Error message if the request failed',
    }),
  })
  .openapi({ title: 'BeaconEventResponse' })

export const ValidationErrorSchema = z
  .object({
    success: z.literal(false).openapi({ example: false }),
    error: z.string().openapi({ description: 'Error summary' }),
    processedAt: z.string().datetime().openapi({
      description: 'Timestamp of the failed processing',
    }),
    validationErrors: z
      .array(
        z.object({
          instancePath: z.string(),
          schemaPath: z.string(),
          keyword: z.string(),
          params: z.record(z.string(), z.any()),
          message: z.string().optional(),
        })
      )
      .optional()
      .openapi({ description: 'Detailed validation errors (if any)' }),
  })
  .openapi({ title: 'ValidationError' })
