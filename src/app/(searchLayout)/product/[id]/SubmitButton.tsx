'use client';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Button, type ButtonProps } from '@/components/ui/button';
import React from 'react';
import { useFormStatus } from 'react-dom';

type SubmitButtonProps = {
  children: React.ReactNode;
  spinner?: boolean;
} & ButtonProps;

export const SubmitButton = ({
  children,
  spinner,
  ...rest
}: SubmitButtonProps) => {
  const { pending } = useFormStatus();

  return (
    <Button {...rest} disabled={pending}>
      {pending && spinner ? <LoadingSpinner /> : children}
    </Button>
  );
};
