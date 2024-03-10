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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { SubmitFn, useFormWithValidation } from '@/lib/hooks/useForm';
import { registerSchema } from '@/lib/schema/registerSchema';

import { ErrorMessage } from '@hookform/error-message';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { useFormStatus } from 'react-dom';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

type FormValues = z.infer<typeof registerSchema>;

type Props = {
  registerFn: SubmitFn;
};
export const RegisterForm = ({ registerFn }: Props) => {
  const { form, formAction } = useFormWithValidation<FormValues>({
    schema: registerSchema,
    defaultValues: {
      name: '',
      email: '',
      password: '',
      repeatPassword: '',
    },
    submitFn: registerFn,
    onSuccess: () => redirect('/'),
  });

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Register</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form action={formAction} className="flex flex-col gap-3">
            <FormContent form={form} />
          </form>
        </Form>
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
