import { RegisterForm } from '@/components/forms/RegisterForm';
import { register } from '@/lib/server/services/authService';

type Props = {
  searchParams: {
    callbackUrl: string | undefined;
  };
};

const RegisterPage = async ({ searchParams }: Props) => {
  const { callbackUrl } = searchParams;

  return (
    <div className="flex w-full flex-col items-center justify-center p-6">
      <RegisterForm submitFn={register} callbackUrl={callbackUrl} />
    </div>
  );
};

export default RegisterPage;
