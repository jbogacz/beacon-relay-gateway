import {
  BeaconEventSchema,
  BeaconEventResponseSchema,
  ValidationErrorSchema,
  BeaconEventSchemaMetadata,
} from '@/schemas/beacon';
import { convertTypeBoxSchemaToOpenAPI } from '@/lib/schema-converter';

// Convert schemas to OpenAPI format
const beaconEventOpenAPI = convertTypeBoxSchemaToOpenAPI(BeaconEventSchema);
const beaconEventResponseOpenAPI = convertTypeBoxSchemaToOpenAPI(BeaconEventResponseSchema);
const validationErrorOpenAPI = convertTypeBoxSchemaToOpenAPI(ValidationErrorSchema);

export const beaconApiDocs = {
  '/api/beacon-events': {
    post: {
      summary: 'Record a beacon event',
      description: 'Records a beacon proximity event (ENTER or EXIT)',
      tags: ['Beacon'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: beaconEventOpenAPI,
            example: BeaconEventSchemaMetadata.examples[0],
          },
        },
      },
      responses: {
        201: {
          description: 'Event recorded successfully',
          content: {
            'application/json': {
              schema: beaconEventResponseOpenAPI,
              example: {
                success: true,
                eventId: 'evt_1688464803957_5fj2n7',
                message: 'Beacon ENTER event processed successfully',
                processedAt: '2025-07-03T12:34:56.789Z',
                data: {
                  subjectId: 'default_subject',
                  beaconUuid: 'e2c56db5-dffb-48d2-b060-d0f5a71096e0',
                  eventType: 'ENTER',
                  signalStrength: -87,
                  major: 666,
                  minor: 0,
                },
              },
            },
          },
        },
        400: {
          description: 'Validation error',
          content: {
            'application/json': {
              schema: validationErrorOpenAPI,
              example: {
                success: false,
                error: 'Validation failed',
                processedAt: '2025-07-03T12:34:56.789Z',
                validationErrors: [
                  {
                    instancePath: '/beacon/uuid',
                    schemaPath: '#/properties/beacon/properties/uuid/format',
                    keyword: 'format',
                    params: { format: 'uuid' },
                    message: 'must match format "uuid"',
                  },
                ],
              },
            },
          },
        },
        500: {
          description: 'Server error',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  error: { type: 'string' },
                  processedAt: { type: 'string', format: 'date-time' },
                },
              },
              example: {
                success: false,
                error: 'Internal server error',
                processedAt: '2025-07-03T12:34:56.789Z',
              },
            },
          },
        },
      },
    },
  },
};
