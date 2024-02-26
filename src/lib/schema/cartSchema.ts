import { zfd } from 'zod-form-data';
import { z } from 'zod';

export const cartSchema = zfd.formData({
  cartId: z.number(),
  itemId: z.string().length(36),
});
