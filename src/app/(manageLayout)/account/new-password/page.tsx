import { NewPasswordForm } from '@/components/forms/PasswordResetForm';
import { getSessionCookie } from '@/lib/server/auth/cookies';
import { db } from '@/lib/server/db';
import { submitNewPasswordForm } from '@/lib/server/services/passwordService';
import { sessions } from '@/lib/server/tables';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';

export default async function NewPasswordPage() {
  const sessionId = getSessionCookie();

  if (!sessionId) {
    return redirect('/login');
  }

  const profile = await getUserProfileDetails(sessionId);

  if (!profile) {
    return redirect('/login');
  }

  return (
    <section className="flex w-full max-w-4xl flex-col items-center gap-8 pt-8">
      <NewPasswordForm
        submitFn={submitNewPasswordForm}
        callbackUrl="/account"
      />
    </section>
  );
}
async function getUserProfileDetails(sessionId: string) {
  const res = await db.query.sessions.findFirst({
    where: eq(sessions.id, sessionId),
    columns: {},
    with: {
      user: {
        columns: {
          id: true,
        },
      },
    },
  });

  if (!res || !res.user) {
    return null;
  }

  return res;
}
