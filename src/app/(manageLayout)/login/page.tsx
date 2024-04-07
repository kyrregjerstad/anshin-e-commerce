import { LoginForm } from '@/components/forms/LoginForm';
import { getSessionCookie } from '@/lib/server/auth/cookies';
import { login } from '@/lib/server/services/authService';
import { checkForLoggedInUser } from '@/lib/server/services/userService';
import { redirect } from 'next/navigation';

type Props = {
  searchParams: {
    callbackUrl: string | undefined;
  };
};

export default async function LoginPage({ searchParams }: Props) {
  const { callbackUrl } = searchParams;

  const sessionId = getSessionCookie();

  const isUserLoggedIn = await checkForLoggedInUser(sessionId);

  if (isUserLoggedIn) {
    redirect(callbackUrl ?? '/');
  }

  return (
    <div className="flex w-full flex-col items-center justify-center p-6">
      <LoginForm submitFn={login} callbackUrl={callbackUrl} />
    </div>
  );
}
