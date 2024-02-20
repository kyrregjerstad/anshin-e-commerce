import { lucia, validateRequest } from '@/lib/auth';
import { LoginForm } from './LoginForm';
import { ActionResult } from 'next/dist/server/app-render/types';
import { DatabaseUser, users } from '@/lib/server/tables';
import { db } from '@/lib/server/db';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Argon2id } from 'oslo/password';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { login } from '@/lib/server/auth/authService';

export default async function LoginPage() {
  const { user } = await validateRequest();

  if (user) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-6">
      <LoginForm action={login} />
    </div>
  );
}
