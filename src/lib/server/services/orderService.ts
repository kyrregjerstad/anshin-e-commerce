'use server';

import { eq } from 'drizzle-orm';
import { generateId } from '../auth/utils';
import { db } from '../db';
import {
  InsertOrderItem,
  cart,
  cartItems,
  orderItems as orderItemsTable,
  orders,
} from '../tables';
import { wait } from '@/lib/utils';

type Order = {
  userId: string;
  orderId: string;
  cartId: string;
  items: {
    productId: string;
    quantity: number;
    priceInCents: number;
    discountInCents: number;
  }[];
};

export async function createNewOrder({
  userId,
  orderId,
  cartId,
  items,
}: Order) {
  try {
    await db.transaction(async (tx) => {
      await tx.insert(orders).values({
        id: orderId,
        status: 'pending',
        userId,
      });

      await tx.insert(orderItemsTable).values(
        items.map((item) => ({
          ...item,
          orderId,
        }))
      );

      await tx.delete(cartItems).where(eq(cartItems.cartId, cartId));
    });
  } catch (error) {
    console.error(error);
  }
}

export async function test({ userId, items }: Order) {
  const orderId = generateId();

  try {
    await db.transaction(async (tx) => {
      await tx.insert(orders).values({
        id: orderId,
        status: 'pending',
        userId,
      });
      await tx.insert(orderItemsTable).values(
        items.map((item) => ({
          ...item,
          orderId,
        }))
      );
    });
  } catch (error) {
    console.error(error);
  }
}
