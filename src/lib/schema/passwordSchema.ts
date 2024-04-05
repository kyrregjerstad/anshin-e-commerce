import { z } from 'zod';

export const securePasswordSchema = z
  .string()
  .min(8, { message: 'Password must be at least 8 characters long' })
  .refine((password) => /[A-Z]/.test(password), {
    message: 'Password must contain at least one uppercase letter',
  })
  .refine((password) => /[a-z]/.test(password), {
    message: 'Password must contain at least one lowercase letter',
  })
  .refine((password) => /[0-9]/.test(password), {
    message: 'Password must contain at least one number',
  })
  .refine((password) => /[\W_]/.test(password), {
    message: 'Password must contain at least one special character',
  });

export const passwordSchema = z.object({
  password: securePasswordSchema,
  repeatPassword: z.string(),
});

export function passwordsMatch(data: {
  password: string;
  repeatPassword: string;
}) {
  return data.password === data.repeatPassword;
}
