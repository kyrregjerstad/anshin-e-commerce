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

export const GridItem = () => {
  return (
    <Card className="aspect-square">
      <CardHeader>
        <CardTitle>Test</CardTitle>
      </CardHeader>
      <CardContent>
        <AspectRatio ratio={16 / 9} className="bg-muted">
          <Image
            src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
            alt="Photo by Drew Beamer"
            fill
            className="rounded-md object-cover"
          />
        </AspectRatio>
      </CardContent>
      <CardFooter className="flex justify-between">
        <GridItemButton />
      </CardFooter>
    </Card>
  );
};
