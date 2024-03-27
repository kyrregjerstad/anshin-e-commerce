'use server';

import { paymentSchema } from '@/lib/schema/paymentSchema';
import valid from 'card-validator';
import { formAction } from '../formAction';

export const verifyPayment = formAction(
  paymentSchema,
  async (validatedData) => {
    const cardNumber = parseInt(validatedData.cardNumber.replace(/\s/g, '')); // Remove spaces
    const result = valid.number(cardNumber);

    if (!result.isValid) {
      return {
        status: 'error',
        message: 'Invalid card number',
        errors: [
          {
            path: 'cardNumber',
            message: 'Invalid card number',
          },
        ],
      };
    }

    return {
      status: 'success',
      message: 'Card verified successfully',
    };
  }
);
