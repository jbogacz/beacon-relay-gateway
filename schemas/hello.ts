import { Type, Static } from '@sinclair/typebox';

// Hello World response schema
export const HelloResponseSchema = Type.Object(
  {
    message: Type.String(),
    timestamp: Type.String({ format: 'date-time' })
  },
  { additionalProperties: false }
);

// Hello with name request schema
export const HelloRequestSchema = Type.Object(
  {
    name: Type.Optional(Type.String())
  },
  { additionalProperties: false }
);

// TypeScript types derived from the schemas
export type HelloResponse = Static<typeof HelloResponseSchema>;
export type HelloRequest = Static<typeof HelloRequestSchema>;
