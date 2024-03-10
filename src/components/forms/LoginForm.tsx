'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ErrorMessage } from '@hookform/error-message';
import Link from 'next/link';
import { useFormStatus } from 'react-dom';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

import { LoadingSpinner } from '@/components/LoadingSpinner';
import { SubmitFn, useFormWithValidation } from '@/lib/hooks/useForm';
import { loginSchema } from '@/lib/schema/loginSchema';
import { redirect } from 'next/navigation';

type FormValues = z.infer<typeof loginSchema>;

type Props = {
  loginFn: SubmitFn;
};

export const LoginForm = ({ loginFn }: Props) => {
  const { form, formAction } = useFormWithValidation<FormValues>({
    schema: loginSchema,
    defaultValues: {
      email: '',
      password: '',
    },
    submitFn: loginFn,
    onSuccess: () => redirect('/'),
  });

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
        <Link className="text-sm font-medium" href="/register">
          Sign up
        </Link>
      </CardFooter>
    </Card>
  );
};

type FormContentProps = {
  form: UseFormReturn<FormValues>;
};

const FormContent = ({ form }: FormContentProps) => {
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
