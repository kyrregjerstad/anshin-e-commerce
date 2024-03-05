import Script from 'next/script';

export const Analytics = () => {
  return (
    <Script
      defer
      data-domain="anshin.world"
      src="https://analytics.kyrre.dev/js/script.js"
    />
  );
};
