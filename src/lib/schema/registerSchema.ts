import { z } from 'zod';
import { passwordSchema, passwordsMatch } from './passwordSchema';

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: 'Name must be at least 2 characters long' })
      .max(50, { message: 'Name must be at most 50 characters long' }),
    email: z.string().email({ message: 'Invalid email' }),
  })
  .merge(passwordSchema)
  .refine(passwordsMatch, {
    message: 'Passwords do not match',
    path: ['repeatPassword'],
  });
