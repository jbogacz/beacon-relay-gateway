import { z } from 'zod'
import { extendZodWithOpenApi, OpenAPIRegistry, OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi'
import {
  BeaconEventSchema,
  BeaconEventResponseSchema,
  ValidationErrorSchema
} from '@/schemas'

// Monkey-patch Zod to support `.openapi()` metadata
extendZodWithOpenApi(z)

// Create a registry for schemas and routes
const registry = new OpenAPIRegistry()

// Register your schemas (includes .openapi() metadata like title/example)
registry.register('BeaconEvent', BeaconEventSchema)
registry.register('BeaconEventResponse', BeaconEventResponseSchema)

// Declare your API path
registry.registerPath({
  method: 'post',
  path: '/api/beacon-events',
  summary: 'Create or record a beacon event',
  tags: ['Beacon'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: BeaconEventSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Beacon event response',
      content: {
        'application/json': {
          schema: BeaconEventResponseSchema,
        },
      },
    },
    400: {
      description: 'Validation error',
      content: {
        'application/json': {
          schema: ValidationErrorSchema,
        },
      },
    }
  },
})

// Generate the OpenAPI v3 document
const generator = new OpenApiGeneratorV3(registry.definitions)
export const openApiDocument = generator.generateDocument({
  openapi: '3.0.0',
  info: {
    title: 'Beacon API',
    version: '1.0.0',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Local development server',
    }
  ],
})
