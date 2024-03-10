'use server';

import { ActionResult } from '@/lib/hooks/useForm';
import { paymentSchema } from '@/lib/schema/paymentSchema';
import { handleErrors } from '@/lib/utils';
import valid from 'card-validator';

export async function verifyPayment(
  _prevState: ActionResult | null,
  data: FormData
): Promise<ActionResult> {
  console.log(data);
  try {
    const formObject = Object.fromEntries(data.entries());
    const result = paymentSchema.parse(formObject);

    valid.number(parseInt(result.cardNumber));
    console.log(result);

    return {
      status: 'success',
      message: 'Card verified successfully',
    };
  } catch (error) {
    console.log(handleErrors(error));
    return handleErrors(error);
  }
}
