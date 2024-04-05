'use client';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ErrorMessage } from '@hookform/error-message';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

import { newPasswordSchema } from '@/lib/schema/resetPasswordSchema';
import { SubmitFn } from '@/lib/server/formAction';
import { redirect } from 'next/navigation';
import { LoadingSpinner } from '../LoadingSpinner';
import { Button } from '../ui/button';
import { Form } from './Form';

type FormValues = z.infer<typeof newPasswordSchema>;

type Props = {
  submitFn: SubmitFn<FormValues>;
  callbackUrl: string | undefined;
};

export const NewPasswordForm = ({ submitFn, callbackUrl }: Props) => {
  const defaultValues = {
    previousPassword: '',
    password: '',
    repeatPassword: '',
  } satisfies FormValues;

  return (
    <Card className="w-full max-w-md" variant="neutral">
      <CardHeader>
        <CardTitle>Reset Password</CardTitle>
      </CardHeader>
      <CardContent>
        <Form
          submitFn={submitFn}
          schema={newPasswordSchema}
          defaultValues={defaultValues}
          render={({ form, pending }) => (
            <FormContent form={form} pending={pending} />
          )}
          onSuccess={() => redirect(callbackUrl || '/')}
          className="space-y-4"
        />
      </CardContent>
      <CardFooter className="flex flex-col items-center" />
    </Card>
  );
};

type FormContentProps = {
  form: UseFormReturn<FormValues>;
  pending: boolean;
};

const FormContent = ({ form, pending }: FormContentProps) => {
  const {
    control,
    formState: { errors },
  } = form;

  return (
    <>
      <FormField
        control={control}
        name="previousPassword"
        render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor="previousPassword">Current Password</FormLabel>
            <FormControl>
              <Input
                id="previousPassword"
                type="password"
                placeholder=""
                {...field}
              />
            </FormControl>
            <FormMessage>
              <ErrorMessage errors={errors} name="previousPassword" />
            </FormMessage>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor="password">New Password</FormLabel>
            <FormControl>
              <Input id="password" type="password" placeholder="" {...field} />
            </FormControl>
            <FormMessage>
              <ErrorMessage errors={errors} name="password" />
            </FormMessage>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="repeatPassword"
        render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor="repeatPassword">Repeat Password</FormLabel>
            <FormControl>
              <Input
                id="repeatPassword"
                type="password"
                placeholder=""
                {...field}
              />
            </FormControl>
            <FormMessage>
              <ErrorMessage errors={errors} name="repeatPassword" />
            </FormMessage>
          </FormItem>
        )}
      />
      <Button type="submit" className="w-full">
        {pending ? <LoadingSpinner /> : <span>Send</span>}
      </Button>
    </>
  );
};
