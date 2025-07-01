// lib/validation.ts
import Ajv, { ErrorObject } from 'ajv';
import addFormats from 'ajv-formats';
import { TSchema, Static } from '@sinclair/typebox';
import { NextResponse } from 'next/server';

// Create AJV instance with format validation
const ajv = new Ajv({
  allErrors: true,
  removeAdditional: false,
  useDefaults: true,
  coerceTypes: false,
  verbose: true
});

// Add format validators (uuid, date-time, etc.)
addFormats(ajv);

// Validation result type
export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: ErrorObject[];
  errorMessage?: string;
}

// Generic validation function
export function validateSchema<T extends TSchema>(
  schema: T,
  data: unknown
): ValidationResult<Static<T>> {
  const validate = ajv.compile(schema);
  const isValid = validate(data);

  if (isValid) {
    return {
      success: true,
      data: data as Static<T>
    };
  }

  return {
    success: false,
    errors: validate.errors || [],
    errorMessage: ajv.errorsText(validate.errors)
  };
}

// Validation middleware for Next.js API routes
export function createValidationMiddleware<T extends TSchema>(schema: T) {
  return async (request: Request): Promise<{
    isValid: boolean;
    data?: Static<T>;
    errorResponse?: NextResponse;
  }> => {
    try {
      const body = await request.json();
      const result = validateSchema(schema, body);

      if (result.success) {
        return {
          isValid: true,
          data: result.data
        };
      }

      // Create detailed error response
      const errorResponse = NextResponse.json({
        success: false,
        error: 'Validation failed',
        message: result.errorMessage,
        validationErrors: result.errors?.map(error => ({
          field: error.instancePath || error.schemaPath,
          message: error.message || 'Validation error',
          value: error.data,
          constraint: error.keyword,
          params: error.params
        })),
        processedAt: new Date().toISOString()
      }, { status: 400 });

      return {
        isValid: false,
        errorResponse
      };

    } catch (error) {
      const errorResponse = NextResponse.json({
        success: false,
        error: 'Invalid JSON payload',
        message: error instanceof Error ? error.message : 'Failed to parse JSON',
        processedAt: new Date().toISOString()
      }, { status: 400 });

      return {
        isValid: false,
        errorResponse
      };
    }
  };
}

// Decorator for automatic validation
export function withValidation<T extends TSchema>(schema: T) {
  return function <F extends Function, ThisType>(
    target: any,
    propertyName: string,
    descriptor: TypedPropertyDescriptor<F>
  ) {
    const method = descriptor.value;

    descriptor.value = async function(this: ThisType, request: Request, ...args: any[]) {
      const validator = createValidationMiddleware(schema);
      const validation = await validator(request);

      if (!validation.isValid) {
        return validation.errorResponse;
      }

      // Call original method with validated data
      return method?.call(this, request, validation.data, ...args);
    } as any as F;

    return descriptor;
  };
}

// Helper function for custom validation rules
export function addCustomFormats() {
  // Add custom beacon UUID format (if needed)
  ajv.addFormat('beacon-uuid', {
    type: 'string',
    validate: (uuid: string) => {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      return uuidRegex.test(uuid);
    }
  });

  // Add signal strength validation
  ajv.addFormat('rssi', {
    type: 'number',
    validate: (rssi: number) => {
      // RSSI values are typically between -100 and 0 dBm
      return rssi >= -120 && rssi <= 10;
    }
  });

  // Add subject ID format
  ajv.addFormat('subject-id', {
    type: 'string',
    validate: (subjectId: string) => {
      // Allow alphanumeric, underscores, hyphens
      return /^[a-zA-Z0-9_-]+$/.test(subjectId);
    }
  });
}

// Initialize custom formats
addCustomFormats();
