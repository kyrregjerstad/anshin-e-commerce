import Script from 'next/script';

export const Analytics = () => {
  return (
    <Script
      defer
      data-domain="anshin.world"
      src={process.env.NEXT_PUBLIC_ANALYTICS_URL}
    />
  );
};
