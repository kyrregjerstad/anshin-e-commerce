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

import { contactSchema } from '@/lib/schema/contactSchema';
import { SubmitFn } from '@/lib/server/formAction';
import { redirect } from 'next/navigation';
import { LoadingSpinner } from '../LoadingSpinner';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Form } from './Form';

type FormValues = z.infer<typeof contactSchema>;

type Props = {
  submitFn: SubmitFn<FormValues>;
  callbackUrl: string | undefined;
};

export const ContactForm = ({ submitFn, callbackUrl }: Props) => {
  const defaultValues = {
    email: '',
    name: '',
    subject: '',
    message: '',
  } satisfies FormValues;

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Contact</CardTitle>
      </CardHeader>
      <CardContent>
        <Form
          submitFn={submitFn}
          schema={contactSchema}
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
        name="subject"
        render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor="subject">Subject</FormLabel>
            <FormControl>
              <Input type="subject" placeholder="subject" {...field} />
            </FormControl>
            <FormMessage>
              <ErrorMessage errors={errors} name="subject" />
            </FormMessage>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="message"
        render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor="message">message</FormLabel>
            <FormControl>
              <Textarea placeholder="message" {...field} />
            </FormControl>
            <FormMessage>
              <ErrorMessage errors={errors} name="message" />
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
