import z from 'zod';

export const input = z.object({
  subject: z.string().optional(),
  name: z.string(),
  replyTo: z.email(),
  text: z.string().optional(),
  html: z.string().optional(),
  attachments: z.array(z.url()).optional(),
  to: z.array(z.email()).optional(),
});

export type Input = z.infer<typeof input>;
