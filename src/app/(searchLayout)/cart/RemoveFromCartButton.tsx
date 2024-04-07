'use client';
import { Button } from '@/components/ui/button';
import { handleRemoveFromCart } from '@/lib/server/services/cartService';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { XCircle } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';

export const RemoveFromCartButton = ({
  itemId,
}: {
  itemId: string;
  cartId: string;
}) => {
  return (
    <form
      action={async () => {
        toast.info('Removed from cart', { icon: <XCircle /> });
        await handleRemoveFromCart(itemId);
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
      <XMarkIcon strokeWidth={1} />
    </Button>
  );
};
