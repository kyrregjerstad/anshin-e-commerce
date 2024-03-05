import { RegisterForm } from './RegisterForm';
import { register } from '@/lib/server/services/authService';

const RegisterPage = async () => {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center p-6">
      <RegisterForm registerFn={register} />
    </div>
  );
};

export default RegisterPage;
