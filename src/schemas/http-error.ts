import z from 'zod';

export const httpError = z.object({
  statusCode: z.number(),
  error: z.string(),
  message: z.string(),
});

export type HttpError = z.infer<typeof httpError>;

export const httpErrorSchema = z.toJSONSchema(httpError, {
  target: 'draft-7',
});
