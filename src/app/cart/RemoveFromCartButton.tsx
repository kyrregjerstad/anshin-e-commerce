'use client';

import { Button } from '@/components/ui/button';
import { removeItemAction } from './actions';

import { X } from 'lucide-react';

export type RemoveFromCartActionResult =
  | {
      status: 'success';
      message: string;
    }
  | {
      status: 'error';
      message: string;
      errors?: Array<{
        path: string;
        message: string;
      }>;
    }
  | null;

type Props = {
  cartId: number;
  itemId: string;
  removeItem: (itemId: string) => void;
};

export const RemoveFromCartButton = ({ cartId, itemId, removeItem }: Props) => {
  return (
    <form
      action={async (formData) => {
        removeItem(itemId);
      }}
    >
      <Button variant="ghost" type="submit">
        <X />
      </Button>
    </form>
  );
};
