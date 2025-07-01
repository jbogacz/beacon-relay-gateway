import { Type, Static } from '@sinclair/typebox';

// Beacon data schema
export const BeaconDataSchema = Type.Object({
  major: Type.Integer({
    minimum: 0,
    maximum: 65535,
    description: 'Beacon major identifier (0-65535)'
  }),
  minor: Type.Integer({
    minimum: 0,
    maximum: 65535,
    description: 'Beacon minor identifier (0-65535)'
  }),
  signalStrength: Type.Number({
    description: 'Signal strength in dBm (typically negative)'
  }),
  timestamp: Type.String({
    format: 'date-time',
    description: 'ISO 8601 timestamp when beacon was detected'
  }),
  uuid: Type.String({
    format: 'uuid',
    description: 'Beacon UUID in standard format'
  })
});

// Beacon event schema
export const BeaconEventSchema = Type.Object({
  timestamp: Type.String({
    format: 'date-time',
    description: 'ISO 8601 timestamp when event occurred'
  }),
  subjectId: Type.String({
    minLength: 1,
    description: 'Identifier for the subject (user, device, etc.)'
  }),
  id: Type.String({
    minLength: 1,
    description: 'Unique identifier for this event'
  }),
  beacon: BeaconDataSchema,
  type: Type.Union([
    Type.Literal('ENTER'),
    Type.Literal('EXIT'),
  ], {
    description: 'Type of beacon event'
  })
});

// Response schemas
export const BeaconEventResponseSchema = Type.Object({
  success: Type.Boolean(),
  eventId: Type.Optional(Type.String()),
  message: Type.Optional(Type.String()),
  processedAt: Type.String({ format: 'date-time' }),
  data: Type.Optional(Type.Object({
    subjectId: Type.String(),
    beaconUuid: Type.String(),
    eventType: Type.String(),
    signalStrength: Type.Number(),
    major: Type.Integer(),
    minor: Type.Integer()
  })),
  error: Type.Optional(Type.String())
});

export const ValidationErrorSchema = Type.Object({
  success: Type.Literal(false),
  error: Type.String(),
  processedAt: Type.String({ format: 'date-time' }),
  validationErrors: Type.Optional(Type.Array(Type.Object({
    instancePath: Type.String(),
    schemaPath: Type.String(),
    keyword: Type.String(),
    params: Type.Record(Type.String(), Type.Any()),
    message: Type.Optional(Type.String())
  })))
});

// TypeScript types derived from schemas
export type BeaconData = Static<typeof BeaconDataSchema>;
export type BeaconEvent = Static<typeof BeaconEventSchema>;
export type BeaconEventResponse = Static<typeof BeaconEventResponseSchema>;
export type ValidationError = Static<typeof ValidationErrorSchema>;

// Schema metadata for documentation
export const BeaconEventSchemaMetadata = {
  title: 'Beacon Event',
  description: 'Schema for beacon proximity events (ENTER, EXIT)',
  version: '1.0.0',
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
        uuid: 'e2c56db5-dffb-48d2-b060-d0f5a71096e0'
      },
      type: 'ENTER'
    }
  ]
};
