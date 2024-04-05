import { z } from 'zod';
import { passwordSchema, passwordsMatch } from './passwordSchema';

export const newPasswordSchema = z
  .object({
    previousPassword: z.string(),
  })
  .merge(passwordSchema)
  .refine(passwordsMatch, {
    message: 'Passwords do not match',
    path: ['repeatPassword'],
  });
