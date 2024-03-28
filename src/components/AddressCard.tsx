import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { InsertAddress } from '@/lib/server/tables';
import Link from 'next/link';

export const AddressCard = ({
  address,
  isSameAddress,
}: {
  address: InsertAddress;
  isSameAddress?: boolean;
}) => {
  const type = address.type === 'shipping' ? 'shipping' : 'billing';
  return (
    <Card variant="neutral" className="flex w-full flex-col justify-between">
      {isSameAddress ? (
        <>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {address.type === 'shipping' ? 'Shipping' : 'Billing'}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:gap-6">
            <p>Same as shipping</p>
          </CardContent>
          <div className="flex-1"></div>
          <CardFooter>
            <Link href={`/checkout/edit-address?type=billing`}>
              <Button>Edit</Button>
            </Link>
          </CardFooter>
        </>
      ) : (
        <>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {address.type === 'shipping' ? 'Shipping' : 'Billing'}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:gap-6">
            <div className="grid gap-1">
              <div className="font-medium">Name</div>
              <div>
                {address.firstName} {address.lastName}
              </div>
            </div>
            <div className="grid gap-1">
              <div className="font-medium">Address</div>
              <div>{address.streetAddress1}</div>
              <div>{address.streetAddress2}</div>
              <div>
                {address.city}, {address.state} {address.postalCode}
              </div>
              <div>{address.country}</div>
            </div>
          </CardContent>
          <CardFooter>
            <Link href={`/checkout/edit-address?type=${type}`}>
              <Button>Edit</Button>
            </Link>
          </CardFooter>
        </>
      )}
    </Card>
  );
};
