'use server';

import { newPasswordSchema } from '@/lib/schema/resetPasswordSchema';
import { handleErrors } from '@/lib/utils';
import { ActionResult, formAction } from '../formAction';
import { getSessionCookie } from '../auth/cookies';
import { db } from '../db';
import { eq } from 'drizzle-orm';
import { sessions, users } from '../tables';
import { Argon2id } from 'oslo/password';
import { ZodError, ZodIssueCode } from 'zod';

export const submitNewPasswordForm = formAction(
  newPasswordSchema,
  async ({ previousPassword, password }): Promise<ActionResult> => {
    try {
      const sessionId = getSessionCookie();

      if (!sessionId) {
        throw new Error('Invalid session');
      }

      const dbSession = await db.query.sessions.findFirst({
        where: eq(sessions.id, sessionId),
        with: {
          user: {
            columns: {
              hashedPassword: true,
            },
          },
        },
      });

      if (!dbSession || !dbSession.userId || !dbSession.user) {
        throw new Error('Invalid session');
      }

      const passwordMatch = await new Argon2id().verify(
        dbSession.user.hashedPassword,
        previousPassword
      );

      if (!passwordMatch) {
        throw new ZodError([
          {
            code: ZodIssueCode.custom,
            message: 'Incorrect password',
            path: ['previousPassword'],
          },
        ]);
      }

      const newPasswordHashed = await new Argon2id().hash(password);

      await db.transaction(async (tx) => {
        await tx
          .update(users)
          .set({
            hashedPassword: newPasswordHashed,
          })
          .where(eq(users.id, dbSession.userId!)); // we know that this is not null
      });

      return {
        status: 'success',
        message: 'Password reset successfully',
      };
    } catch (error) {
      return handleErrors(error);
    }
  }
);
