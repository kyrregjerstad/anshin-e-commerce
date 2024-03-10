'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { SubmitFn } from '@/lib/hooks/useForm';
import { paymentSchema } from '@/lib/schema/paymentSchema';
import { ErrorMessage } from '@hookform/error-message';
import { useFormStatus } from 'react-dom';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { LoadingSpinner } from '../LoadingSpinner';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Form } from './Form';

type FormValues = z.infer<typeof paymentSchema>;

type Props = {
  submitFn: SubmitFn;
};
export const PaymentForm = ({ submitFn }: Props) => {
  const defaultValues = {
    name: '',
    cardNumber: '',
    month: '',
    year: '',
    cvc: '',
  };

  return (
    <Card className="w-full max-w-3xl" variant="neutral">
      <CardHeader>
        <CardTitle>Payment information</CardTitle>
        <CardDescription>
          You will have a chance to review your order before completing your
          purchase.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Form
          schema={paymentSchema}
          defaultValues={defaultValues}
          submitFn={submitFn}
          render={({ form }) => <FormContent form={form} />}
        />
      </CardContent>
      <CardFooter />
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
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor="name">Name</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage>
              <ErrorMessage errors={errors} name="name" />
            </FormMessage>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="cardNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor="cardNumber">Card number</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage>
              <ErrorMessage errors={errors} name="cardNumber" />
            </FormMessage>
          </FormItem>
        )}
      />
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <FormField
            control={control}
            name="month"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="month">Month</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage>
                  <ErrorMessage errors={errors} name="month" />
                </FormMessage>
              </FormItem>
            )}
          />
        </div>
        <div className="space-y-2">
          <FormField
            control={control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="year">Year</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage>
                  <ErrorMessage errors={errors} name="year" />
                </FormMessage>
              </FormItem>
            )}
          />
        </div>
        <div className="space-y-2">
          <FormField
            control={control}
            name="cvc"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="cvc">CVC</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage>
                  <ErrorMessage errors={errors} name="cvc" />
                </FormMessage>
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" className="col-span-3">
          {pending ? <LoadingSpinner /> : 'Next'}
        </Button>
      </div>
    </>
  );
};
