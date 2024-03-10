import { z } from 'zod';
import isCreditCard from 'validator/lib/isCreditCard';

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;

export const paymentSchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    cardNumber: z.string().refine(isCreditCard, {
      message:
        'Card number is invalid. \n\n Tip: You can use the following test card number: 4242 4242 4242 4242',
    }),
    month: z
      .string()
      .length(2, 'Month must be 2 digits')
      .refine(
        (month) => {
          return parseInt(month) >= 1 && parseInt(month) <= 12;
        },
        {
          message: 'Month must be between 01 and 12',
        }
      ),
    year: z
      .string()
      .length(4, 'Year must be 4 digits')
      .refine((year) => parseInt(year) >= currentYear, {
        message: 'Year cannot be in the past',
      }),
    cvc: z.string().length(3, 'CVC must be 3 digits'),
  })
  .refine(
    (data) => {
      const expYear = parseInt(data.year, 10);
      const expMonth = parseInt(data.month, 10);

      if (expYear === currentYear) {
        return expMonth >= currentMonth;
      }

      return true;
    },
    {
      message: 'The card has expired',
      path: ['month'],
    }
  );
