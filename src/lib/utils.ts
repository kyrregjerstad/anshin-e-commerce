import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ZodError } from 'zod';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function handleErrors(error: any) {
  if (error instanceof ZodError) {
    return {
      status: 'error',
      message: 'Invalid form data',
      errors: error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: `${issue.message}`,
      })),
    } as const;
  }

  return {
    status: 'error',
    message: 'Something went wrong. Please try again.',
  } as const;
}
