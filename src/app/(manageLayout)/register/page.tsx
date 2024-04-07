import { RegisterForm } from '@/components/forms/RegisterForm';
import { getSessionCookie } from '@/lib/server/auth/cookies';
import { register } from '@/lib/server/services/authService';
import { checkForLoggedInUser } from '@/lib/server/services/userService';
import { redirect } from 'next/navigation';

type Props = {
  searchParams: {
    callbackUrl: string | undefined;
  };
};

const RegisterPage = async ({ searchParams }: Props) => {
  const { callbackUrl } = searchParams;

  const sessionId = getSessionCookie();

  const isUserLoggedIn = await checkForLoggedInUser(sessionId);

  if (isUserLoggedIn) {
    redirect(callbackUrl ?? '/');
  }

  return (
    <div className="flex w-full flex-col items-center justify-center p-6">
      <RegisterForm submitFn={register} callbackUrl={callbackUrl} />
    </div>
  );
};

export default RegisterPage;
