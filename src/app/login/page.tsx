import { LoginForm } from '@/components/forms/LoginForm';
import { login } from '@/lib/server/services/authService';

type Props = {
  searchParams: {
    callbackUrl: string | undefined;
  };
};

export default async function LoginPage({ searchParams }: Props) {
  const { callbackUrl } = searchParams;

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center p-6">
      <LoginForm loginFn={login} callbackUrl={callbackUrl} />
    </div>
  );
}
