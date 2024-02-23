import { zfd } from 'zod-form-data';
import { z } from 'zod';

export const loginSchema = zfd.formData({
  email: z.string().email({ message: 'Invalid email, testing' }),
  password: z.string(),
});
