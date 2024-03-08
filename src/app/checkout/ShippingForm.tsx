// 'use client';

// import { Button } from '@/components/ui/button';
// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from '@/components/ui/card';
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from '@/components/ui/form';
// import { Input } from '@/components/ui/input';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import { ErrorMessage } from '@hookform/error-message';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { useEffect } from 'react';
// import { useFormState, useFormStatus } from 'react-dom';
// import { UseFormReturn, useForm } from 'react-hook-form';
// import { z } from 'zod';

// const shippingAddressSchema = z.object({
//   firstName: z.string().min(2).max(50),
//   lastName: z.string().min(2).max(50),
//   address: z.string().min(5).max(100),
//   city: z.string().min(2).max(50),
//   zip: z.string().min(2).max(20),
//   country: z.string().min(2).max(50),
// });

// type FormValues = z.infer<typeof shippingAddressSchema>;

// type Props = {
//   submitFn: (
//     prevState: any,
//     formData: FormData
//   ) => Promise<ShippingActionResult>;
// };

// export const ShippingForm = ({ submitFn }: Props) => {
//   const [state, formAction] = useFormState<ShippingActionResult, FormData>(
//     submitFn,
//     null
//   );

//   const form = useForm<FormValues>({
//     resolver: zodResolver(shippingAddressSchema),
//     criteriaMode: 'all',
//     defaultValues: {
//       firstName: '',
//       lastName: '',
//       address: '',
//       city: '',
//       zip: '',
//       country: '',
//     },
//   });

//   const { setError, reset } = form;

//   useEffect(() => {
//     if (!state) {
//       return;
//     }
//   }, [state]);

//   return (
//     <Card variant="neutral">
//       <CardHeader>
//         <CardTitle>
//           <h1 className="text-2xl font-semibold md:text-3xl">
//             Shipping Address
//           </h1>
//         </CardTitle>
//       </CardHeader>
//       <Form {...form}>
//         <form action={formAction}>
//           <FormContent form={form} />
//         </form>
//       </Form>
//     </Card>
//   );
// };

// type FormContentProps = {
//   form: UseFormReturn<FormValues>;
// };

// const FormContent = ({ form }: FormContentProps) => {
//   const { pending } = useFormStatus();
//   const {
//     control,
//     formState: { errors },
//   } = form;

//   return (
//     <>
//       <CardContent className="grid gap-4 md:gap-8">
//         <FormField
//           control={control}
//           name="firstName"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel htmlFor="firstName">First name</FormLabel>
//               <FormControl>
//                 <Input placeholder="First name" {...field} />
//               </FormControl>
//               <FormMessage>
//                 <ErrorMessage errors={errors} name="firstName" />
//               </FormMessage>
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={control}
//           name="lastName"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel htmlFor="lastName">Last name</FormLabel>
//               <FormControl>
//                 <Input placeholder="Last name" {...field} />
//               </FormControl>
//               <FormMessage>
//                 <ErrorMessage errors={errors} name="lastName" />
//               </FormMessage>
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={control}
//           name="address"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel htmlFor="address">Address</FormLabel>
//               <FormControl>
//                 <Input placeholder="Address" {...field} />
//               </FormControl>
//               <FormMessage>
//                 <ErrorMessage errors={errors} name="address" />
//               </FormMessage>
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={control}
//           name="city"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel htmlFor="city">City</FormLabel>
//               <FormControl>
//                 <Input placeholder="City" {...field} />
//               </FormControl>
//               <FormMessage>
//                 <ErrorMessage errors={errors} name="city" />
//               </FormMessage>
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={control}
//           name="zip"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel htmlFor="zip">Zip</FormLabel>
//               <FormControl>
//                 <Input placeholder="Zip" {...field} />
//               </FormControl>
//               <FormMessage>
//                 <ErrorMessage errors={errors} name="zip" />
//               </FormMessage>
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={control}
//           name="country"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel htmlFor="country">Country</FormLabel>
//               <Select onValueChange={field.onChange} defaultValue={field.value}>
//                 <SelectTrigger className="w-[200px]">
//                   <SelectValue placeholder="Country" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="United States">United States</SelectItem>
//                   <SelectItem value="Canada">Canada</SelectItem>
//                   <SelectItem value="Mexico">Mexico</SelectItem>
//                 </SelectContent>
//               </Select>
//               <FormMessage>
//                 <ErrorMessage errors={errors} name="country" />
//               </FormMessage>
//             </FormItem>
//           )}
//         />
//       </CardContent>
//       <CardFooter>
//         <Button type="submit">Continue to payment</Button>
//       </CardFooter>
//     </>
//   );
// };
