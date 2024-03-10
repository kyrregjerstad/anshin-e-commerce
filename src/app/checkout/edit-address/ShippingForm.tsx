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
import { FieldPath, UseFormReturn, useForm } from 'react-hook-form';
import { UpsertAddressActionResult } from './upsertAddress';
import { Address, addressSchema } from './addressSchema';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { revalidatePath, revalidateTag } from 'next/cache';

type Props = {
  addressType: 'shipping' | 'billing';
  shippingAddress: Address | null;
  submitFn: (
    prevState: any,
    formData: FormData
  ) => Promise<UpsertAddressActionResult>;
};

export const ShippingForm = ({
  shippingAddress,
  addressType,
  submitFn,
}: Props) => {
  const [state, formAction] = useFormState<UpsertAddressActionResult, FormData>(
    submitFn,
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
      type: addressType,
    },
  });

  const { setError, reset } = form;

  useEffect(() => {
    if (!state) {
      return;
    }

    if (state.status === 'error') {
      state.errors?.forEach((error) => {
        setError(error.path as FieldPath<Address>, {
          message: error.message,
        });
      });
    }

    if (state.status === 'success') {
      redirect('/checkout/address');
    }
  }, [state]);

  return (
    <Card variant="neutral">
      <CardHeader>
        <CardTitle>
          <h1 className="text-2xl font-semibold md:text-3xl">
            {addressType} address
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

  console.log(errors);

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
                    <SelectItem value="United States">United States</SelectItem>
                    <SelectItem value="Canada">Canada</SelectItem>
                    <SelectItem value="Mexico">Mexico</SelectItem>
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
                <Input
                  placeholder="Type"
                  {...field}
                  value={field.value ?? ''}
                />
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
