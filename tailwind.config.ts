import type { Config } from 'tailwindcss';

const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      maxWidth: {
        '8xl': '88rem',
        '9xl': '105rem',
        '10xl': '1920px',
        '11xl': '2200px',
      },
      colors: {
        border: 'oklch(var(--border) / <alpha-value>)',
        input: 'oklch(var(--input) / <alpha-value>)',
        ring: 'oklch(var(--ring) / <alpha-value>)',
        background: 'oklch(var(--background) / <alpha-value>)',
        foreground: 'oklch(var(--foreground) / <alpha-value>)',
        primary: {
          DEFAULT: 'oklch(var(--primary) / <alpha-value>)',
          foreground: 'oklch(var(--primary-foreground) / <alpha-value>)',
        },
        secondary: {
          DEFAULT: 'oklch(var(--secondary) / <alpha-value>)',
          foreground: 'oklch(var(--secondary-foreground) / <alpha-value>)',
        },
        destructive: {
          DEFAULT: 'oklch(var(--destructive) / <alpha-value>)',
          foreground: 'oklch(var(--destructive-foreground) / <alpha-value>)',
        },
        muted: {
          DEFAULT: 'oklch(var(--muted) / <alpha-value>)',
          foreground: 'oklch(var(--muted-foreground) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'oklch(var(--accent) / <alpha-value>)',
          foreground: 'oklch(var(--accent-foreground) / <alpha-value>)',
        },
        popover: {
          DEFAULT: 'oklch(var(--popover) / <alpha-value>)',
          foreground: 'oklch(var(--popover-foreground) / <alpha-value>)',
        },
        card: {
          DEFAULT: 'oklch(var(--card) / <alpha-value>)',
          foreground: 'oklch(var(--card-foreground) / <alpha-value>)',
        },
        tea: {
          '50': 'oklch(97.56% 0.02 120.68 / <alpha-value>)',
          '100': 'oklch(94.50% 0.04 120.53 / <alpha-value>)',
          '200': 'oklch(89.50% 0.07 121.34 / <alpha-value>)',
          '300': 'oklch(82.54% 0.11 124.24 / <alpha-value>)',
          '400': 'oklch(75.52% 0.13 125.37 / <alpha-value>)',
          '500': 'oklch(66.69% 0.14 126.91 / <alpha-value>)',
          '600': 'oklch(56.07% 0.12 127.78 / <alpha-value>)',
          '700': 'oklch(46.94% 0.09 127.56 / <alpha-value>)',
          '800': 'oklch(40.46% 0.07 127.62 / <alpha-value>)',
          '900': 'oklch(36.76% 0.06 128.02 / <alpha-value>)',
          '950': 'oklch(24.81% 0.04 128.46 / <alpha-value>)',
        },
        ember: {
          '50': 'oklch(98.16% 0.02 79.35 / <alpha-value>)',
          '100': 'oklch(95.78% 0.04 80.90 / <alpha-value>)',
          '200': 'oklch(90.96% 0.08 76.15 / <alpha-value>)',
          '300': 'oklch(84.94% 0.12 71.24 / <alpha-value>)',
          '400': 'oklch(77.57% 0.16 59.98 / <alpha-value>)',
          '500': 'oklch(72.49% 0.19 50.66 / <alpha-value>)',
          '600': 'oklch(66.38% 0.19 43.37 / <alpha-value>)',
          '700': 'oklch(56.72% 0.17 40.36 / <alpha-value>)',
          '800': 'oklch(48.12% 0.14 39.78 / <alpha-value>)',
          '900': 'oklch(41.75% 0.12 41.00 / <alpha-value>)',
          '950': 'oklch(27.09% 0.08 38.93 / <alpha-value>)',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'spin-medium': 'spin 1.6s linear infinite',
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 3s infinite',
        'pulse-medium': 'pulse 2s infinite',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      dropShadow: {
        flat: '0 0 3px oklch(var(--border))',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;

export default config;
