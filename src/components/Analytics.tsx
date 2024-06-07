import Script from 'next/script';

export const Analytics = () => {
  return (
    <Script
      defer
      data-domain="anshin.world"
      src="https://insight.webstad.com/js/script.js"
    />
  );
};
