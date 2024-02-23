import { AspectRatio } from '@/components/ui/aspect-ratio';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Image from 'next/image';
import { GridItemButton } from './GridItemButton';
import { Product } from '@/lib/server/productService';

type Props = {
  product: Product;
};

export const GridItem = ({ product }: Props) => {
  const { title, description, images } = product;

  const coverImageUrl = images[0].url;
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <AspectRatio ratio={16 / 9} className="bg-muted">
          <Image
            src={coverImageUrl}
            alt="Photo by Drew Beamer"
            fill
            className="rounded-md object-cover"
          />
        </AspectRatio>
      </CardContent>
      <div className="flex-1" />
      <CardFooter className="flex justify-between">
        <GridItemButton />
      </CardFooter>
    </Card>
  );
};
