'use client';

import {
  CardTitle,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useFormState } from 'react-dom';

import React from 'react';
import { ActionResult } from 'next/dist/server/app-render/types';

type Props = {
  action: (prevState: any, formData: FormData) => Promise<ActionResult>;
};
export const LoginForm = ({ action }: Props) => {
  const [state, formAction] = useFormState(action, {
    error: null,
  });

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>User Login</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-4" action={formAction}>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" placeholder="Email" type="email" />
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              placeholder="Password"
              type="password"
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox id="remember-me" />
              <label
                className="text-sm font-medium leading-none"
                htmlFor="remember-me"
              >
                Remember me
              </label>
            </div>
            <Link className="text-sm" href="#">
              Forgot password?
            </Link>
          </div>
          <Button className="mt-4">Sign in</Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col items-center">
        <span className="text-sm">Don't have an account?</span>
        <Link className="text-sm font-medium" href="#">
          Sign up
        </Link>
      </CardFooter>
      <p>{state.error}</p>
    </Card>
  );
};
