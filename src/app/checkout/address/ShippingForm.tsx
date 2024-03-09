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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ErrorMessage } from '@hookform/error-message';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { UseFormReturn, useForm } from 'react-hook-form';
import { z } from 'zod';

const addressSchema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  streetAddress1: z.string().min(5).max(100),
  streetAddress2: z.string().min(2).max(100),
  city: z.string().min(2).max(50),
  state: z.string().min(2).max(50),
  postalCode: z.string().min(2).max(20),
  country: z.string().min(2).max(50),
  type: z.enum(['shipping', 'billing']),
});

type Address = z.infer<typeof addressSchema>;

type Props = {
  shippingAddress: Address | null;
};

export const ShippingForm = ({ shippingAddress }: Props) => {
  const [state, formAction] = useFormState<ShippingActionResult, FormData>(
    () => null,
    null
  );

  const form = useForm<Address>({
    resolver: zodResolver(addressSchema),
    criteriaMode: 'all',
    defaultValues: {
      firstName: shippingAddress?.firstName ?? '',
      lastName: shippingAddress?.lastName ?? '',
      streetAddress1: shippingAddress?.streetAddress1 ?? '',
      streetAddress2: shippingAddress?.streetAddress2 ?? '',
      city: shippingAddress?.city ?? '',
      state: shippingAddress?.state ?? '',
      postalCode: shippingAddress?.postalCode ?? '',
      country: shippingAddress?.country ?? '',
      type: 'shipping',
    },
  });

  const { setError, reset } = form;

  useEffect(() => {
    if (!state) {
      return;
    }
  }, [state]);

  return (
    <Card variant="neutral">
      <CardHeader>
        <CardTitle>
          <h1 className="text-2xl font-semibold md:text-3xl">
            Shipping Address
          </h1>
        </CardTitle>
      </CardHeader>
      <Form {...form}>
        <form action={formAction}>
          <FormContent form={form} />
        </form>
      </Form>
    </Card>
  );
};

type FormContentProps = {
  form: UseFormReturn<Address>;
};

const FormContent = ({ form }: FormContentProps) => {
  const { pending } = useFormStatus();
  const {
    control,
    formState: { errors },
  } = form;

  return (
    <>
      <CardContent className="grid gap-4 md:gap-8">
        <FormField
          control={control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="firstName">First name</FormLabel>
              <FormControl>
                <Input placeholder="First name" {...field} />
              </FormControl>
              <FormMessage>
                <ErrorMessage errors={errors} name="firstName" />
              </FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="lastName">Last name</FormLabel>
              <FormControl>
                <Input placeholder="Last name" {...field} />
              </FormControl>
              <FormMessage>
                <ErrorMessage errors={errors} name="lastName" />
              </FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="streetAddress1"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="address">Address</FormLabel>
              <FormControl>
                <Input placeholder="Address" {...field} />
              </FormControl>
              <FormMessage>
                <ErrorMessage errors={errors} name="streetAddress1" />
              </FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="streetAddress2"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="address2">Address 2</FormLabel>
              <FormControl>
                <Input placeholder="Address 2" {...field} />
              </FormControl>
              <FormMessage>
                <ErrorMessage errors={errors} name="streetAddress2" />
              </FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="city">City</FormLabel>
              <FormControl>
                <Input placeholder="City" {...field} />
              </FormControl>
              <FormMessage>
                <ErrorMessage errors={errors} name="city" />
              </FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="postalCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="zip">Zip</FormLabel>
              <FormControl>
                <Input placeholder="Zip" {...field} />
              </FormControl>
              <FormMessage>
                <ErrorMessage errors={errors} name="postalCode" />
              </FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="state">State</FormLabel>
              <FormControl>
                <Input placeholder="State" {...field} />
              </FormControl>
              <FormMessage>
                <ErrorMessage errors={errors} name="state" />
              </FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="country">Country</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="United States">United States</SelectItem>
                  <SelectItem value="Canada">Canada</SelectItem>
                  <SelectItem value="Mexico">Mexico</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage>
                <ErrorMessage errors={errors} name="country" />
              </FormMessage>
            </FormItem>
          )}
        />
      </CardContent>
      <CardFooter>
        <Button type="submit">Continue to payment</Button>
      </CardFooter>
    </>
  );
};
