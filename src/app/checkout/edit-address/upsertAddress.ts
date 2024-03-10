'use server';
import { ActionResult } from '@/lib/hooks/useForm';
import { getSessionCookie } from '@/lib/server/auth/cookies';
import { generateId } from '@/lib/server/auth/utils';
import { db } from '@/lib/server/db';
import { address as addressTable, sessions } from '@/lib/server/tables';
import { handleErrors } from '@/lib/utils';
import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { addressSchema } from './addressSchema';

export async function upsertAddress(
  _prevState: ActionResult | null,
  data: FormData
): Promise<ActionResult> {
  try {
    const formData = Object.fromEntries(data.entries());
    const address = addressSchema.parse(formData);

    const sessionId = getSessionCookie();

    if (!sessionId) {
      return {
        status: 'error',
        message: 'Invalid session',
      };
    }

    const currentUser = await db.query.sessions.findFirst({
      where: eq(sessions.id, sessionId),
      columns: {
        userId: true,
      },
    });

    if (!currentUser || !currentUser.userId) {
      return {
        status: 'error',
        message: 'Invalid session',
      };
    }

    const existingAddress = await db.query.address.findFirst({
      where: and(
        eq(addressTable.userId, currentUser.userId),
        eq(addressTable.type, address.type)
      ),
    });

    if (!existingAddress) {
      await db
        .insert(addressTable)
        .values({
          ...address,
          id: generateId(),
          userId: currentUser.userId,
        })
        .execute();
    } else {
      await db
        .update(addressTable)
        .set({
          ...address,
        })
        .where(
          and(
            eq(addressTable.userId, currentUser.userId),
            eq(addressTable.type, address.type)
          )
        );
    }

    revalidatePath('/checkout/address');

    return {
      status: 'success',
      message: 'Logged in successfully',
    };
  } catch (error) {
    return handleErrors(error);
  }
}
