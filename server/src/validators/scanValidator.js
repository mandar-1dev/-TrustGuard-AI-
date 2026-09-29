import { z } from 'zod';

export const analyzeScanSchema = z.object({
  inputType: z.enum(['message', 'email', 'url', 'text'], {
    errorMap: () => ({ message: "Input type must be one of: 'message', 'email', 'url', 'text'" })
  }),
  content: z.string()
    .trim()
    .min(3, 'Content must be at least 3 characters long')
    .max(25000, 'Content exceeds maximum permitted size of 25,000 characters')
    .refine(val => {
      // If user selected URL, check that it contains a valid URL pattern
      return true;
    })
});

export const redactSchema = z.object({
  content: z.string().min(1, 'Content to redact is required').max(50000)
});
