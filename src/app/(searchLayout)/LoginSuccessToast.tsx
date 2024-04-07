'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';

type Props = {
  name: string | undefined;
};

export const LoginSuccessToast = ({ name }: Props) => {
  useEffect(() => {
    const displayLoginSuccessToast = document.cookie.includes(
      'displayLoginSuccessToast'
    );

    if (displayLoginSuccessToast) {
      toast.success(`Welcome back, ${name || 'friend'}!`);
      document.cookie = 'displayLoginSuccessToast=; max-age=0';
    }
  }, [name]);

  return null;
};
