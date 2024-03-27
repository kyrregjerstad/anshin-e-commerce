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
import Link from 'next/link';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

import { loginSchema } from '@/lib/schema/loginSchema';
import { redirect } from 'next/navigation';
import { LoadingSpinner } from '../LoadingSpinner';
import { Button } from '../ui/button';
import { Form } from './Form';
import { SubmitFn } from '@/lib/server/formAction';

type FormValues = z.infer<typeof loginSchema>;

type Props = {
  submitFn: SubmitFn<FormValues>;
  callbackUrl: string | undefined;
};

export const LoginForm = ({ submitFn, callbackUrl }: Props) => {
  const defaultValues = {
    email: '',
    password: '',
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>User Login</CardTitle>
      </CardHeader>
      <CardContent>
        <Form
          submitFn={submitFn}
          schema={loginSchema}
          defaultValues={defaultValues}
          render={({ form, pending }) => (
            <FormContent form={form} pending={pending} />
          )}
          onSuccess={() => redirect(callbackUrl ?? '/')}
        />
      </CardContent>
      <CardFooter className="flex flex-col items-center">
        <span className="text-sm">Don&apos;t have an account?</span>
        <Link className="text-sm font-medium" href="/register">
          Sign up
        </Link>
      </CardFooter>
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
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor="email">Email</FormLabel>
            <FormControl>
              <Input placeholder="email@noroff.no" {...field} />
            </FormControl>
            <FormMessage>
              <ErrorMessage errors={errors} name="email" />
            </FormMessage>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor="password">Password</FormLabel>
            <FormControl>
              <Input type="password" placeholder="password" {...field} />
            </FormControl>
            <FormMessage>
              <ErrorMessage errors={errors} name="password" />
            </FormMessage>
          </FormItem>
        )}
      />
      <Button type="submit">
        {pending ? <LoadingSpinner /> : <span>Login</span>}
      </Button>
    </>
  );
};
