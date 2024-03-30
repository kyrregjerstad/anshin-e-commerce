import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatUSD } from '@/lib/utils';

export const OrderSummaryTable = ({
  items,
}: {
  items: {
    id: string;
    title: string;
    price: number;
    discountPrice: number;
    quantity: number;
    totalPrice: number;
  }[];
}) => {
  const totalPrice = items.reduce(
    (acc, item) => acc + item.discountPrice * item.quantity,
    0
  );

  const calculateDiscount = (price: number, discountPrice: number) => {
    const difference = price - discountPrice;
    if (difference === 0) {
      return '-';
    }
    return `${Math.round((difference / price) * 100)}%`;
  };
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Qty</TableHead>
          <TableHead>Orig. Price</TableHead>
          <TableHead>Disc. Price</TableHead>
          <TableHead>Disc. %</TableHead>
          <TableHead>Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map(
          ({ id, title, quantity, price, discountPrice, totalPrice }) => (
            <TableRow key={id}>
              <TableCell className="font-medium">{title}</TableCell>
              <TableCell>{quantity}</TableCell>
              <TableCell>{formatUSD(price)}</TableCell>
              <TableCell>
                {discountPrice === price ? (
                  <span>-</span>
                ) : (
                  formatUSD(discountPrice)
                )}
              </TableCell>
              <TableCell>{calculateDiscount(price, discountPrice)}</TableCell>
              <TableCell>{formatUSD(totalPrice)}</TableCell>
            </TableRow>
          )
        )}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={5}>Total</TableCell>
          <TableCell>{formatUSD(totalPrice)}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};
