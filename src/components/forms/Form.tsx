import { Form as FormCn } from '@/components/ui/form';
import { SubmitFn, useFormWithValidation } from '@/lib/hooks/useForm';
import React, { useRef } from 'react';
import { DefaultValues, FieldValues } from 'react-hook-form';
import { ZodSchema } from 'zod';

type Props<T extends FieldValues> = {
  schema: ZodSchema;
  defaultValues: DefaultValues<T>;
  submitFn: SubmitFn;
  onSuccess?: () => void;
  render: (
    formMethods: ReturnType<typeof useFormWithValidation<T>>
  ) => React.ReactNode;
};

export function Form<T extends FieldValues>({
  schema,
  defaultValues,
  submitFn,
  render,
  onSuccess,
}: Props<T>) {
  const formRef = useRef<HTMLFormElement>(null);

  const { form, formAction } = useFormWithValidation<T>({
    schema,
    defaultValues,
    submitFn,
    onSuccess,
  });

  return (
    <FormCn {...form}>
      <form
        ref={formRef}
        action={formAction}
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit(() => {
            formRef.current?.submit();
          })(e);
        }}
      >
        {render({ form, formAction })}
      </form>
    </FormCn>
  );
}
