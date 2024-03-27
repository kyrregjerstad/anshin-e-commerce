import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ZodError, ZodSchema, z } from 'zod';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function handleErrors(error: any) {
  if (error instanceof ZodError) {
    return {
      status: 'error',
      message: 'Invalid form data',
      errors: createFormError(error.errors),
    } as const;
  }

  return {
    status: 'error',
    message: 'Something went wrong. Please try again.',
  } as const;
}

export function createFormError<T extends string | number>(
  errors: Array<{ path: T[]; message: string }>
) {
  return errors.map((error) => {
    return {
      path: error.path.join('.'),
      message: error.message,
    };
  });
}

export type SchemaKeys<T extends ZodSchema> = keyof z.TypeOf<T>;

export function formatUSD(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}

export async function wait(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
