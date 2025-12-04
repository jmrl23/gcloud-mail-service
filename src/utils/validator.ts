import { BadRequest } from 'http-errors';
import z from 'zod';

export function validator<T extends z.ZodObject>(
  input: Record<string, unknown>,
  schema: T,
) {
  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    const field = parsed.error.issues[0].path[0];
    const message = parsed.error.issues[0].message;
    throw new BadRequest(`[${field.toString()}] ${message}`);
  }
  return parsed.data;
}
