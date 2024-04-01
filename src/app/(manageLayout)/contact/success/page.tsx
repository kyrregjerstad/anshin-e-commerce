import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react';

const ContactSuccessPage = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-2 text-center">
      <h1>Thank you for contacting us!</h1>
      <p>We will get back to you as soon as possible.</p>
      <Link href="/" className={buttonVariants({ className: 'w-full' })}>
        Back Home
      </Link>
    </div>
  );
};

export default ContactSuccessPage;
