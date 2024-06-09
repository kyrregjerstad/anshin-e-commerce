import { LoginForm } from '@/components/forms/LoginForm';
import { login } from '@/lib/server/services/authService';
import { Suspense } from 'react';

type Props = {
  searchParams: {
    callbackUrl: string | undefined;
  };
};

export default async function LoginPage({ searchParams }: Props) {
  const { callbackUrl } = searchParams;

  return (
    <div className="flex w-full flex-col items-center justify-center p-6">
      <Suspense>
        <LoginForm submitFn={login} callbackUrl={callbackUrl} />
      </Suspense>
    </div>
  );
}
