'use client';

import { Button, buttonVariants } from '@/components/ui/button';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Address, addressSchema } from '@/lib/schema/addressSchema';
import { SubmitFn } from '@/lib/server/formAction';
import { ErrorMessage } from '@hookform/error-message';
import { countries } from 'countries-list';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { Form } from './Form';

type Props = {
  addressType: 'shipping' | 'billing';
  shippingAddress: Address | null;
  submitFn: SubmitFn<Address>;
};

export const ShippingForm = ({
  shippingAddress,
  addressType,
  submitFn,
}: Props) => {
  const defaultValues = {
    firstName: shippingAddress?.firstName,
    lastName: shippingAddress?.lastName,
    streetAddress1: shippingAddress?.streetAddress1,
    streetAddress2: shippingAddress?.streetAddress2,
    city: shippingAddress?.city,
    state: shippingAddress?.state,
    postalCode: shippingAddress?.postalCode,
    country: shippingAddress?.country,
    type: addressType,
  };

  return (
    <Card variant="neutral">
      <CardHeader>
        <CardTitle>
          <h1 className="text-2xl font-semibold md:text-3xl">
            {addressType} address
          </h1>
        </CardTitle>
      </CardHeader>
      <Form
        submitFn={submitFn}
        schema={addressSchema}
        defaultValues={defaultValues}
        onSuccess={() => redirect('/checkout/address')}
        render={({ form, pending }) => (
          <FormContent form={form} pending={pending} />
        )}
      ></Form>
    </Card>
  );
};

type FormContentProps = {
  form: UseFormReturn<z.infer<typeof addressSchema>>;
  pending: boolean;
};

const FormContent = ({ form, pending }: FormContentProps) => {
  const {
    control,
    formState: { errors },
  } = form;

  return (
    <>
      <CardContent className="grid gap-4 sm:grid-cols-2 md:gap-4">
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
                <Input
                  placeholder="Address 2"
                  {...field}
                  value={field.value ?? ''}
                />
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
                <Input
                  placeholder="City"
                  {...field}
                  value={field.value ?? ''}
                />
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
                <Input
                  placeholder="State"
                  {...field}
                  value={field.value ?? ''}
                />
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
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  {...field}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Country" />
                  </SelectTrigger>

                  <SelectContent>
                    {Object.entries(countries).map(
                      ([countryCode, countryData]) => (
                        <SelectItem key={countryCode} value={countryCode}>
                          {countryData.name}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage>
                <ErrorMessage errors={errors} name="country" />
              </FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="type">Type</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  {...field}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="shipping">Shipping</SelectItem>
                    <SelectItem value="billing">Billing</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage>
                <ErrorMessage errors={errors} name="type" />
              </FormMessage>
            </FormItem>
          )}
        />
      </CardContent>
      <CardFooter className="flex gap-4">
        <Button type="submit" disabled={pending}>
          Save
        </Button>
        <Link
          className={buttonVariants({ variant: 'outline' })}
          href="/checkout/address"
        >
          Cancel
        </Link>
      </CardFooter>
    </>
  );
};
