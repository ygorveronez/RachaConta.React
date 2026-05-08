/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Paleta espelhada de RachaConta/.../ui/theme/Color.kt
        brand: {
          50: '#F0F1FF',
          100: '#E1E3FF',
          200: '#C5C9FF',
          300: '#8087E5',
          400: '#4750D9',
          500: '#1E27CC', // Royal Blue — primary
          600: '#1820B5',
          700: '#131A8F',
          800: '#0E1366',
          900: '#0A0E4A',
        },
        lime: {
          100: '#ECF7C5',
          400: '#C7EE5C',
          500: '#B5E62F', // Lime — accent / success
          600: '#9BCB18',
        },
        danger: {
          100: '#FEE2E2',
          500: '#EF4444',
          600: '#DC2626',
        },
        warning: {
          100: '#FEF3C7',
          500: '#F59E0B',
        },
        ink: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
      },
      fontFamily: {
        // Mantemos `display` como alias de `Inter` para não quebrar classes existentes.
        display: ['"Inter"', 'system-ui', 'sans-serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(17, 24, 39, 0.06), 0 1px 2px rgba(17, 24, 39, 0.04)',
        soft: '0 8px 30px rgba(30, 39, 204, 0.08)',
        glow: '0 0 0 4px rgba(30, 39, 204, 0.15)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out both',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 8s ease infinite',
      },
    },
  },
  plugins: [],
};
