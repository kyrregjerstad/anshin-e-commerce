import { z } from 'zod';

export const contactSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'Name must be at least 3 characters' })
    .max(255, { message: 'Name must be at most 255 characters' }),
  email: z.string().email({ message: 'Invalid email' }),
  subject: z
    .string()
    .min(3, { message: 'Subject must be at least 3 characters' })
    .max(255, { message: 'Subject must be at most 255 characters' }),
  message: z
    .string()
    .min(3, { message: 'Message must be at least 3 characters' })
    .max(1000, { message: 'Message must be at most 1000 characters' }),
});
