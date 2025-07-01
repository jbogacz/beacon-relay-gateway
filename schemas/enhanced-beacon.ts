// schemas/enhanced-beacon.ts
import { Type, Static } from '@sinclair/typebox';

// Enhanced beacon data schema with custom formats
export const EnhancedBeaconDataSchema = Type.Object({
  major: Type.Integer({
    minimum: 0,
    maximum: 65535,
    description: 'Beacon major identifier (0-65535)',
    examples: [666, 123, 1]
  }),
  minor: Type.Integer({
    minimum: 0,
    maximum: 65535,
    description: 'Beacon minor identifier (0-65535)',
    examples: [0, 456, 1]
  }),
  signalStrength: Type.Number({
    minimum: -120,
    maximum: 10,
    description: 'Signal strength in dBm (typically -120 to 0)',
    examples: [-87, -65, -95]
  }),
  timestamp: Type.String({
    format: 'date-time',
    description: 'ISO 8601 timestamp when beacon was detected',
    examples: ['2025-06-28T06:40:05.702Z']
  }),
  uuid: Type.String({
    format: 'uuid',
    description: 'Beacon UUID in standard format',
    examples: ['e2c56db5-dffb-48d2-b060-d0f5a71096e0']
  })
});

// Enhanced beacon event schema with stricter validation
export const EnhancedBeaconEventSchema = Type.Object({
  timestamp: Type.String({
    format: 'date-time',
    description: 'ISO 8601 timestamp when event occurred',
    examples: ['2025-06-28T06:40:05.703Z']
  }),
  subjectId: Type.String({
    minLength: 1,
    maxLength: 100,
    pattern: '^[a-zA-Z0-9_-]+$',
    description: 'Identifier for the subject (alphanumeric, underscore, hyphen only)',
    examples: ['default_subject', 'user_123', 'device-abc']
  }),
  id: Type.String({
    minLength: 1,
    maxLength: 50,
    description: 'Unique identifier for this event',
    examples: ['1', 'evt_001', 'beacon-event-123']
  }),
  beacon: EnhancedBeaconDataSchema,
  type: Type.Union([
    Type.Literal('ENTER'),
    Type.Literal('EXIT'),
    Type.Literal('RANGE_UPDATE')
  ], {
    description: 'Type of beacon event',
    examples: ['ENTER', 'EXIT', 'RANGE_UPDATE']
  })
}, {
  additionalProperties: false, // Don't allow extra properties
  description: 'Beacon proximity event payload',
  examples: [{
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
  }]
});

// Batch beacon events schema (for processing multiple events)
export const BeaconEventBatchSchema = Type.Object({
  events: Type.Array(EnhancedBeaconEventSchema, {
    minItems: 1,
    maxItems: 100,
    description: 'Array of beacon events to process'
  }),
  batchId: Type.Optional(Type.String({
    description: 'Optional batch identifier'
  })),
  deviceInfo: Type.Optional(Type.Object({
    deviceId: Type.String(),
    platform: Type.Union([Type.Literal('ios'), Type.Literal('android'), Type.Literal('web')]),
    appVersion: Type.Optional(Type.String()),
    sdkVersion: Type.Optional(Type.String())
  }))
});

// Query parameters schema for GET requests
export const BeaconEventQuerySchema = Type.Object({
  subjectId: Type.Optional(Type.String({
    description: 'Filter by subject ID'
  })),
  beaconUuid: Type.Optional(Type.String({
    format: 'uuid',
    description: 'Filter by beacon UUID'
  })),
  eventType: Type.Optional(Type.Union([
    Type.Literal('ENTER'),
    Type.Literal('EXIT'),
    Type.Literal('RANGE_UPDATE')
  ])),
  fromDate: Type.Optional(Type.String({
    format: 'date-time',
    description: 'Filter events from this date'
  })),
  toDate: Type.Optional(Type.String({
    format: 'date-time',
    description: 'Filter events to this date'
  })),
  limit: Type.Optional(Type.Integer({
    minimum: 1,
    maximum: 1000,
    default: 100,
    description: 'Maximum number of events to return'
  })),
  offset: Type.Optional(Type.Integer({
    minimum: 0,
    default: 0,
    description: 'Number of events to skip'
  }))
});

// Export TypeScript types
export type EnhancedBeaconData = Static<typeof EnhancedBeaconDataSchema>;
export type EnhancedBeaconEvent = Static<typeof EnhancedBeaconEventSchema>;
export type BeaconEventBatch = Static<typeof BeaconEventBatchSchema>;
export type BeaconEventQuery = Static<typeof BeaconEventQuerySchema>;
