'use client';

import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
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
import { registerSchema } from '@/lib/schema/registerSchema';
import { SubmitFn } from '@/lib/server/formAction';

import { ErrorMessage } from '@hookform/error-message';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { Form } from './Form';

type FormValues = z.infer<typeof registerSchema>;

type Props = {
  submitFn: SubmitFn<FormValues>;
  callbackUrl: string | undefined;
};
export const RegisterForm = ({ submitFn, callbackUrl }: Props) => {
  const defaultValues = {
    name: '',
    email: '',
    password: '',
    repeatPassword: '',
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Register</CardTitle>
      </CardHeader>
      <CardContent>
        <Form
          submitFn={submitFn}
          schema={registerSchema}
          defaultValues={defaultValues}
          render={({ form, pending }) => (
            <FormContent form={form} pending={pending} />
          )}
          onSuccess={() => redirect(callbackUrl ?? '/')}
        />
        {/* <form action={formAction} className="flex flex-col gap-3"> */}

        {/* </form> */}
      </CardContent>
      <CardFooter className="flex flex-col items-center">
        <span className="text-sm">Already have an account?</span>
        <Link className="text-sm font-medium" href="/login">
          Log in
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
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor="name">Name</FormLabel>
            <FormControl>
              <Input placeholder="your name" {...field} />
            </FormControl>
            <FormMessage>
              <ErrorMessage errors={errors} name="name" />
            </FormMessage>
          </FormItem>
        )}
      />
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
      <FormField
        control={control}
        name="repeatPassword"
        render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor="repeatPassword">Repeat Password</FormLabel>
            <FormControl>
              <Input type="password" placeholder="repeat password" {...field} />
            </FormControl>
            <FormMessage>
              <ErrorMessage errors={errors} name="repeatPassword" />
            </FormMessage>
          </FormItem>
        )}
      />
      <Button type="submit">
        {pending ? <LoadingSpinner /> : <span>Register</span>}
      </Button>
    </>
  );
};
