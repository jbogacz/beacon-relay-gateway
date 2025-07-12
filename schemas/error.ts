import z from "zod";

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
