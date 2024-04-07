'use client';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const QuantitySelect = () => {
  return (
    <div>
      <Label className="text-base" htmlFor="quantity">
        Quantity
        <Select defaultValue="1" name="quantity">
          <SelectTrigger className="w-32" id="quantity" name="quantity">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent id="quantity">
            <SelectItem value="1">1</SelectItem>
            <SelectItem value="2">2</SelectItem>
            <SelectItem value="3">3</SelectItem>
            <SelectItem value="4">4</SelectItem>
            <SelectItem value="5">5</SelectItem>
          </SelectContent>
        </Select>
      </Label>
    </div>
  );
};
