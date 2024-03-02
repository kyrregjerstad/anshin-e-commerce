import { cn } from '@/lib/utils';
import { StarIcon } from 'lucide-react';

export const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, index) => (
        <StarIcon
          className={cn(
            'size-4 ',
            rating > index
              ? 'fill-neutral-800 stroke-neutral-800 opacity-75'
              : 'fill-transparent stroke-muted-foreground opacity-50'
          )}
          key={index}
        />
      ))}
    </div>
  );
};
