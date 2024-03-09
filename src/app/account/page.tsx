import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getSessionCookie } from '@/lib/server/auth/cookies';
import { getUserBySessionId } from '@/lib/server/services/userService';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function AccountPage() {
  const sessionId = getSessionCookie();

  if (!sessionId) {
    return redirect('/login');
  }

  const user = await getUserBySessionId(sessionId);

  if (!user) {
    return redirect('/login');
  }

  const { shippingAddress, billingAddress } = user;

  return (
    <>
      <section className="flex w-full flex-col gap-8 pt-8">
        <Card variant="neutral" className="w-full">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>
              Your profile information is used to personalize your experience.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:gap-6">
            <div className="flex justify-between gap-2">
              <div className="grid gap-1">
                <div className="font-medium">Name</div>
                <div>{user.name}</div>
              </div>
              <div className="grid gap-1">
                <div className="font-medium">Email</div>
                <div>{user.email}</div>
              </div>
            </div>
            <div className="grid gap-1">
              <div className="font-medium">Password</div>
              <div>
                <Link
                  className="text-blue-600 underline transition-all hover:underline"
                  href="#"
                >
                  Change password
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="neutral">
          <CardHeader>
            <CardTitle>Addresses</CardTitle>
            <CardDescription>
              Manage your shipping and billing addresses.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Shipping</TableHead>
                  <TableHead>Billing</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <DisplayAddress address={shippingAddress} />
                  </TableCell>
                  <TableCell>
                    <DisplayAddress address={billingAddress} />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card variant="neutral">
          <CardHeader>
            <CardTitle>Order history</CardTitle>
            <CardDescription>
              View details about your past orders.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Order</TableHead>
                  <TableHead className="min-w-[150px]">Date</TableHead>
                  <TableHead className="hidden md:table-cell">Items</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="hidden sm:table-cell">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">#3210</TableCell>
                  <TableCell>February 20, 2022</TableCell>
                  <TableCell className="hidden md:table-cell">2</TableCell>
                  <TableCell className="text-right">$42.25</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    Shipped
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">#3209</TableCell>
                  <TableCell>January 5, 2022</TableCell>
                  <TableCell className="hidden md:table-cell">1</TableCell>
                  <TableCell className="text-right">$74.99</TableCell>
                  <TableCell className="hidden sm:table-cell">Paid</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">#3204</TableCell>
                  <TableCell>August 3, 2021</TableCell>
                  <TableCell className="hidden md:table-cell">3</TableCell>
                  <TableCell className="text-right">$64.75</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    Unfulfilled
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">#3203</TableCell>
                  <TableCell>July 15, 2021</TableCell>
                  <TableCell className="hidden md:table-cell">1</TableCell>
                  <TableCell className="text-right">$34.50</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    Shipped
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">#3202</TableCell>
                  <TableCell>June 5, 2021</TableCell>
                  <TableCell className="hidden md:table-cell">1</TableCell>
                  <TableCell className="text-right">$89.99</TableCell>
                  <TableCell className="hidden sm:table-cell">Paid</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">#3201</TableCell>
                  <TableCell>May 20, 2021</TableCell>
                  <TableCell className="hidden md:table-cell">1</TableCell>
                  <TableCell className="text-right">$24.99</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    Unfulfilled
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">#3207</TableCell>
                  <TableCell>November 2, 2021</TableCell>
                  <TableCell className="hidden md:table-cell">1</TableCell>
                  <TableCell className="text-right">$99.99</TableCell>
                  <TableCell className="hidden sm:table-cell">Paid</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">#3206</TableCell>
                  <TableCell>October 7, 2021</TableCell>
                  <TableCell className="hidden md:table-cell">1</TableCell>
                  <TableCell className="text-right">$67.50</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    Shipped
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
type Address = {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  streetAddress1: string;
  streetAddress2: string | null;
  city: string | null;
  state: string | null;
  postalCode: string;
  country: string;
  type: 'shipping' | 'billing';
};
const DisplayAddress = ({ address }: { address: Address | null }) => {
  if (!address) {
    return (
      <div>
        <div className="font-medium">No address on file</div>
      </div>
    );
  }
  return (
    <div>
      <div className="font-medium">
        {address.firstName} {address.lastName}
      </div>
      <div>{address.streetAddress1}</div>
      <div>{address.streetAddress2}</div>
      <div>
        {address.city}, {address.state} {address.postalCode}
      </div>
      <div>{address.country}</div>
    </div>
  );
};
