import { z } from 'zod';

export const addressSchema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  streetAddress1: z.string().min(5).max(100),
  streetAddress2: z.string().max(100).nullable(),
  city: z.string().max(50).nullable(),
  state: z.string().min(2).max(50).nullable(),
  postalCode: z.string().min(2).max(20),
  country: z.string().min(2).max(50),
  type: z.enum(['shipping', 'billing']),
});

export type Address = z.infer<typeof addressSchema>;
