import { TSchema } from '@sinclair/typebox';

export function convertTypeBoxSchemaToOpenAPI(schema: TSchema): any {
  // Simple implementation for basic types
  if (schema.type === 'object') {
    const properties: Record<string, any> = {};
    const required: string[] = [];

    if (schema.properties) {
      for (const [key, prop] of Object.entries(schema.properties)) {
        properties[key] = convertTypeBoxSchemaToOpenAPI(prop as TSchema);

        if (schema.required && schema.required.includes(key)) {
          required.push(key);
        }
      }
    }

    return {
      type: 'object',
      properties,
      ...(required.length > 0 ? { required } : {}),
      ...(schema.additionalProperties === false ? { additionalProperties: false } : {})
    };
  }

  if (schema.type === 'string' && schema.format) {
    return {
      type: 'string',
      format: schema.format
    };
  }

  // For simple types just return the type
  return { type: schema.type };
}
