'use client';
import Link from 'next/link';
import { ReactNode } from 'react';
import { SimpleForm } from './SimpleForm';
import { Button, buttonVariants } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

type Props = {
  children: ReactNode;
  logOutAction: () => void;
  user: {
    id: string;
    name: string;
  } | null;
};
export const UserAccountMenu = ({ children, logOutAction, user }: Props) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="flex size-8 items-center rounded-full p-0"
          variant="ghost"
        >
          {children}
          <span className="sr-only">Toggle user menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" side="bottom">
        {user ? (
          <>
            <DropdownMenuLabel>Hi, {user.name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="/account">Account</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>My Orders</DropdownMenuItem>
            <DropdownMenuItem>Help</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <SimpleForm
                className="w-full"
                action={logOutAction}
                render={({ SubmitButton }) => (
                  <SubmitButton className="w-full" size="sm">
                    Log Out
                  </SubmitButton>
                )}
              />
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuLabel>Hi, guest! 👋</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link
                href="/login"
                className={buttonVariants({
                  variant: 'default',
                  className: 'w-full',
                })}
              >
                Login
              </Link>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
