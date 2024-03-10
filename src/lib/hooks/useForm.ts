import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useFormState } from 'react-dom';
import {
  UseFormReturn,
  useForm as useHookForm,
  type FieldPath,
  type FieldValues,
  type DefaultValues,
} from 'react-hook-form';
import { ZodSchema, z } from 'zod';

export type SubmitFn = (
  prevState: any,
  formData: FormData
) => Promise<ActionResult>;

type Props<TFormValues extends FieldValues> = {
  schema: ZodSchema;
  defaultValues: DefaultValues<TFormValues>;
  submitFn: SubmitFn;
  onSuccess?: () => void;
};

export const useFormWithValidation = <TFormValues extends FieldValues>({
  schema,
  defaultValues,
  submitFn,
  onSuccess,
}: Props<TFormValues>) => {
  const [state, formAction] = useFormState<ActionResult, FormData>(
    submitFn,
    null
  );

  const form = useHookForm<TFormValues>({
    resolver: zodResolver(schema),
    criteriaMode: 'all',
    defaultValues,
  });

  const { setError, reset } = form;

  const status = state?.status;

  useEffect(() => {
    console.log(status);
    if (!status) {
      return;
    }

    if (status === 'error') {
      setFormErrors<TFormValues>(state, setError);
    }

    if (status === 'success') {
      reset();
      onSuccess?.();
    }
  }, [status, setError, reset]);

  return { form, formAction };
};

export type ActionResult = Success | Error | null;

type Success = {
  status: 'success';
  message: string;
};

type Error = {
  status: 'error';
  message: string;
  errors?: Array<{
    path: string;
    message: string;
  }>;
};

function setFormErrors<TFormValues extends FieldValues>(
  state: Error,
  setError: UseFormReturn<TFormValues>['setError']
) {
  state.errors?.forEach((error) => {
    setError(error.path as FieldPath<TFormValues>, {
      message: error.message,
    });
  });
}
