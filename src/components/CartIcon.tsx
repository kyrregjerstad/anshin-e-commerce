'use client';
import { useCartStore } from '@/lib/stores/cart';
import { cn } from '@/lib/utils';
import { m, AnimatePresence, LazyMotion, domAnimation } from 'framer-motion';

export const CartIcon = () => {
  const { items } = useCartStore();

  const cartAmount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      <div className="relative">
        <Svg cartAmount={cartAmount} />
        <div className="pointer-events-none absolute left-0 top-0 flex aspect-square w-full items-center justify-center overflow-hidden text-center">
          <LazyMotion features={domAnimation}>
            <AnimatePresence mode="wait">
              {cartAmount > 0 && (
                <m.div
                  key={cartAmount}
                  initial={{ x: 0, y: 40, opacity: 0 }}
                  animate={{ x: 0, y: 7, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ type: 'tween', duration: 0.2 }}
                >
                  {cartAmount}
                </m.div>
              )}
            </AnimatePresence>
          </LazyMotion>
        </div>
      </div>
    </>
  );
};

const Svg = ({ cartAmount }: { cartAmount: number | undefined }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={40}
    fill={cn(
      cartAmount
        ? 'oklch(89.50% 0.07 121.34 / 1)'
        : 'oklch(89.50% 0.07 121.34 / 0)'
    )}
    className="transition-fill duration-300"
    viewBox="0 0 52 59"
  >
    <path
      stroke="#000"
      strokeLinecap="round"
      strokeWidth={2}
      d="M16 16v-4.227c0-3.038 1.29-5.934 3.548-7.966v0a9.645 9.645 0 0 1 12.904 0v0A10.717 10.717 0 0 1 36 11.773V16m15 33V11.982A.985.985 0 0 0 50 11H2.483c-.545 0-.99.42-1 .966C1.399 17.114 1 41.363 1 48.5c0 8 .5 8 7 8h35.5c7.5 0 7.5 0 7.5-7.5Z"
    />
  </svg>
);
