import { handleErrors } from '@/lib/utils';
import { FieldValues } from 'react-hook-form';

import { ZodSchema } from 'zod';

type FormDataProcessor<T> = (validatedData: T) => Promise<ActionResult>;

export function formAction<T extends FieldValues>(
  schema: ZodSchema<T>,
  process: FormDataProcessor<T>
): SubmitFn<T> {
  return async (data) => {
    try {
      const validatedData = schema.parse(data);
      return await process(validatedData);
    } catch (error) {
      console.log('error', error);
      return handleErrors(error);
    }
  };
}

export type ActionResult = ActionSuccess | ActionError | null;

type ActionSuccess = {
  status: 'success';
  message: string;
};

export type ActionError = {
  status: 'error';
  message: string;
  errors?: Array<{
    path: string;
    message: string;
  }>;
};

export type SubmitFn<T extends FieldValues> = (
  data: T
) => Promise<ActionResult>;
