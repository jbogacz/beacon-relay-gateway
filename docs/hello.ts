import {
  HelloResponseSchema,
  HelloRequestSchema
} from '@/schemas/hello';
import { convertTypeBoxSchemaToOpenAPI } from '@/lib/schema-converter';

// Convert schemas to OpenAPI format
const helloResponseOpenAPI = convertTypeBoxSchemaToOpenAPI(HelloResponseSchema);
const helloRequestOpenAPI = convertTypeBoxSchemaToOpenAPI(HelloRequestSchema);

export const helloApiDocs = {
  '/api/hello': {
    get: {
      summary: 'Get a Hello World message',
      description: 'Returns a simple Hello World message',
      tags: ['Hello'],
      parameters: [
        {
          in: 'query',
          name: 'name',
          required: false,
          schema: { type: 'string' },
          description: 'Optional name to personalize the greeting'
        }
      ],
      responses: {
        200: {
          description: 'Hello World response',
          content: {
            'application/json': {
              schema: helloResponseOpenAPI,
              example: {
                message: 'Hello, World!',
                timestamp: '2025-07-03T12:34:56.789Z'
              }
            }
          }
        }
      }
    },
    post: {
      summary: 'Send a name for a personalized greeting',
      description: 'Send your name to get a personalized greeting',
      tags: ['Hello'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: helloRequestOpenAPI,
            example: {
              name: 'John'
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Personalized greeting',
          content: {
            'application/json': {
              schema: helloResponseOpenAPI,
              example: {
                message: 'Hello, John!',
                timestamp: '2025-07-03T12:34:56.789Z'
              }
            }
          }
        },
        400: {
          description: 'Invalid request',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string' },
                  code: { type: 'string' }
                }
              },
              example: {
                message: 'Invalid request data',
                code: 'VALIDATION_ERROR'
              }
            }
          }
        }
      }
    }
  }
};
