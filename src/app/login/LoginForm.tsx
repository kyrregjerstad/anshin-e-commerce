'use client';

import Link from 'next/link';
import {
  CardTitle,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from '@/components/ui/card';
import { ErrorMessage } from '@hookform/error-message';
import { Button } from '@/components/ui/button';
import { useFormState, useFormStatus } from 'react-dom';
import React, { useEffect } from 'react';
import { type FieldPath, useForm, UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginActionResult } from '@/lib/server/services/authService';
import { loginSchema } from '@/lib/schema/loginSchema';
import { LoadingSpinner } from '@/components/LoadingSpinner';

type FormValues = z.infer<typeof loginSchema>;

type Props = {
  loginFn: (prevState: any, formData: FormData) => Promise<LoginActionResult>;
};
export const LoginForm = ({ loginFn }: Props) => {
  const [state, formAction] = useFormState<LoginActionResult, FormData>(
    loginFn,
    null
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(loginSchema),
    criteriaMode: 'all',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { setError, reset } = form;

  useEffect(() => {
    if (!state) {
      return;
    }
    if (state.status === 'error') {
      state.errors?.forEach((error) => {
        setError(error.path as FieldPath<FormValues>, {
          message: error.message,
        });
      });
    }
    if (state.status === 'success') {
      reset();
    }
  }, [state, setError, reset]);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>User Login</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form action={formAction} className="flex flex-col gap-3">
            <FormContent form={form} />
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col items-center">
        <span className="text-sm">Don't have an account?</span>
        <Link className="text-sm font-medium" href="#">
          Sign up
        </Link>
      </CardFooter>
    </Card>
  );
};

type FormContentProps = {
  form: UseFormReturn<FormValues>;
};

export const FormContent = ({ form }: FormContentProps) => {
  const { pending } = useFormStatus();
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
