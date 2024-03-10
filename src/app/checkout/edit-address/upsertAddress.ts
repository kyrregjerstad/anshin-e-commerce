'use server';
import { db } from '@/lib/server/db';
import { ZodError } from 'zod';
import { address as addressTable, sessions } from '@/lib/server/tables';
import { generateId } from '@/lib/server/auth/utils';
import { getSessionDetails } from '@/lib/server/services/sessionService';
import { getSessionCookie } from '@/lib/server/auth/cookies';
import { and, eq } from 'drizzle-orm';
import { addressSchema } from './addressSchema';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export type UpsertAddressActionResult =
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

export async function upsertAddress(
  _prevState: UpsertAddressActionResult | null,
  data: FormData
): Promise<UpsertAddressActionResult> {
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

    const res = await db
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

    revalidatePath('/checkout/address');

    return {
      status: 'success',
      message: 'Logged in successfully',
    };
  } catch (error) {
    console.log(handleError(error));
    return handleError(error);
  }
}

function handleError(error: any) {
  if (error instanceof ZodError) {
    return {
      status: 'error',
      message: 'Invalid form data',
      errors: error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: `${issue.message}`,
      })),
    } as const;
  }

  return {
    status: 'error',
    message: 'Something went wrong. Please try again.',
  } as const;
}
