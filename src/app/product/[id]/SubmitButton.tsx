'use client';
import { Button, type ButtonProps } from '@/components/ui/button';
import React from 'react';
import { useFormStatus } from 'react-dom';

type SubmitButtonProps = {
  children: React.ReactNode;
} & ButtonProps;

export const SubmitButton = ({ children, ...rest }: SubmitButtonProps) => {
  const { pending } = useFormStatus();

  return (
    <Button {...rest} disabled={pending}>
      {children}
    </Button>
  );
};
