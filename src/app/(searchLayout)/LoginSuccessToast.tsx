'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';

type Props = {
  name: string | undefined;
};

export const CookiesToast = ({ name }: Props) => {
  useEffect(() => {
    const displayLoginSuccessToast = document.cookie.includes(
      'displayLoginSuccessToast'
    );

    const displayLogoutSuccessToast = document.cookie.includes(
      'displayLogoutSuccessToast'
    );

    if (displayLoginSuccessToast) {
      toast.success(`Welcome back, ${name || 'friend'}! 👋`);
      document.cookie = 'displayLoginSuccessToast=; max-age=0';
    }

    if (displayLogoutSuccessToast) {
      toast.info('Bye, see you soon! 👋');
      document.cookie = 'displayLogoutSuccessToast=; max-age=0';
    }
  }, [name]);

  return null;
};
