'use client';
import { Button } from '@/components/ui/button';
import { handleRemoveFromCart } from '@/lib/server/services/cartService';
import { useRef } from 'react';
import { useFormStatus } from 'react-dom';

export const RemoveFromCartButton = ({
  itemId,
  cartId,
}: {
  itemId: string;
  cartId: string;
}) => {
  return (
    <form
      action={async () => {
        await handleRemoveFromCart(cartId, itemId);
      }}
    >
      <SubmitButton />
    </form>
  );
};

const SubmitButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button
      variant="ghost"
      size="smIcon"
      className="text-xl"
      disabled={pending}
    >
      x
    </Button>
  );
};
