'use client';
import { Form as FormCn } from '@/components/ui/form';
import { useFormWithValidation } from '@/lib/hooks/useFormWithValidation';
import { SubmitFn } from '@/lib/server/formAction';
import React, { useEffect } from 'react';
import {
  DefaultValues,
  FieldValues,
  SubmitHandler,
  UseFormReturn,
} from 'react-hook-form';
import { ZodSchema } from 'zod';

type Props<T extends FieldValues> = {
  schema: ZodSchema;
  defaultValues: DefaultValues<T>;
  submitFn: SubmitFn<T>;
  onSuccess?: () => void;
  render: ({ pending, ...formMethods }: Render<T>) => React.ReactNode;
};

export function Form<T extends FieldValues>({
  schema,
  defaultValues,
  submitFn,
  render,
  onSuccess,
}: Props<T>) {
  const { form, processForm } = useFormWithValidation<T>({
    schema,
    defaultValues,
    submitFn,
    onSuccess,
  });

  const { handleSubmit, formState } = form;

  useEffect(() => {
    if (formState.isSubmitSuccessful) {
      onSuccess?.();
    }
  }, [formState.isSubmitSuccessful, onSuccess]);

  return (
    <FormCn {...form}>
      <form onSubmit={handleSubmit(processForm)}>
        {render({
          form,
          processForm,
          pending: formState.isSubmitting,
        })}
      </form>
    </FormCn>
  );
}

type Render<T extends FieldValues> = {
  form: UseFormReturn<T>;
  processForm: SubmitHandler<T>;
  pending: boolean;
};
