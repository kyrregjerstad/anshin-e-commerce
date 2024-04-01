/* eslint-disable drizzle/enforce-delete-with-where */
'use server';

import { contactSchema } from '@/lib/schema/contactSchema';
import { handleErrors } from '@/lib/utils';
import { ActionResult, formAction } from '../formAction';

export const submitContactForm = formAction(
  contactSchema,
  async (form): Promise<ActionResult> => {
    try {
      return {
        status: 'success',
        message: 'Logged in successfully',
      };
    } catch (error) {
      console.log('error', error);
      return handleErrors(error);
    }
  }
);
