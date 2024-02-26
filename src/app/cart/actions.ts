'use server';

import { cartSchema } from '@/lib/schema/cartSchema';
import { db } from '@/lib/server/db';
import { cart, cartItems } from '@/lib/server/tables';
import { and, eq } from 'drizzle-orm';
import { revalidateTag } from 'next/cache';
import { ZodError } from 'zod';

export type RemoveItemActionResult =
  | {
      status: 'success';
      message: string;
    }
  | {
      status: 'error';
      message: string;
      errors?: Array<{
        path: string;
        message: string;
      }>;
    }
  | null;

type RemoveItemAction = {
  prevState: any;
  payload: {
    itemId: string;
    cartId: number;
  };
};

export async function removeItemAction(
  _prevState: any,
  itemId: string,
  cartId: number
): Promise<RemoveItemActionResult> {
  try {
    console.log(cartId, itemId);

    await db
      .delete(cartItems)
      .where(and(eq(cart.id, cartId), eq(cartItems.productId, itemId)));

    revalidateTag('cart');

    return { status: 'success', message: 'Item removed from cart' };
  } catch (e) {
    if (e instanceof Error) {
      return { status: 'error', message: e.message };
    }
    if (e instanceof ZodError) {
      return {
        status: 'error',
        message: 'Validation error',
        errors: e.errors.map((err) => ({
          path: err.path.join('.'),
          message: err.message,
        })),
      };
    }
    return { status: 'error', message: 'An error occurred' };
  }
}
