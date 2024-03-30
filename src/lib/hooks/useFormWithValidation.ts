import { zodResolver } from '@hookform/resolvers/zod';
import {
  SubmitHandler,
  UseFormReturn,
  useForm as useHookForm,
  type DefaultValues,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';
import { ZodSchema } from 'zod';
import { ActionError, SubmitFn } from '../server/formAction';
import { redirect } from 'next/navigation';

type Props<T extends FieldValues> = {
  schema: ZodSchema;
  defaultValues: DefaultValues<T>;
  submitFn: SubmitFn<T>;
  onSuccess?: () => void;
};

export const useFormWithValidation = <T extends FieldValues>({
  schema,
  defaultValues,
  submitFn,
  onSuccess,
}: Props<T>) => {
  const form = useHookForm<T>({
    resolver: zodResolver(schema),
    criteriaMode: 'all',
    defaultValues,
  });

  const { setError, reset } = form;

  const processForm: SubmitHandler<T> = async (data) => {
    const res = await submitFn(data);

    if (!res) {
      setFormErrors(
        { status: 'error', message: 'Something went wrong. Please try again.' },
        setError
      );
    }

    if (res?.status === 'error') {
      setFormErrors(res, setError);
    }
  };

  return { form, processForm };
};

function setFormErrors<T extends FieldValues>(
  state: ActionError,
  setError: UseFormReturn<T>['setError']
) {
  state.errors?.forEach((error) => {
    setError(error.path as FieldPath<T>, {
      message: error.message,
    });
  });
}
