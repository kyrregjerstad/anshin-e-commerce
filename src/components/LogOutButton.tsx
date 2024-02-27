'use client';

import React from 'react';
import { Button } from './ui/button';
import { logOut } from '@/lib/server/auth/authService';

export const LogOutButton = () => {
  return (
    <form
      action={async () => {
        await logOut();
      }}
    >
      <Button type="submit">Log Out</Button>
    </form>
  );
};
