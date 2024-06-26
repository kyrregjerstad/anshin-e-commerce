'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';

export const CookiesToast = () => {
  useEffect(() => {
    const displayLoginSuccessToast = document.cookie.includes(
      'displayLoginSuccessToast'
    );

    const displayLogoutSuccessToast = document.cookie.includes(
      'displayLogoutSuccessToast'
    );

    if (displayLoginSuccessToast) {
      toast.success(`Welcome back! 👋`);
      document.cookie = 'displayLoginSuccessToast=; max-age=0';
    }

    if (displayLogoutSuccessToast) {
      toast.info('Bye, see you soon! 👋');
      document.cookie = 'displayLogoutSuccessToast=; max-age=0';
    }
  }, []);

  return null;
};
