/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        'primary-text': 'var(--primary-text-color)',
        'secondary-text': 'var(--secondary-text-color)',
        link: {
          DEFAULT: 'var(--link-color)',
          hover: 'var(--link-hover-color)',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        background: 'hsl(var(--background))',
        surface: 'var(--surface-color)',
        border: 'hsl(var(--border))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
        },
      },
      fontFamily: {
        heading: [
          'Songti SC',
          'Noto Serif SC',
          'Source Han Serif SC',
          'STSong',
          'Georgia',
          'Cambria',
          'Times New Roman',
          'serif',
        ],
        body: [
          'PingFang SC',
          'Hiragino Sans GB',
          'Noto Sans SC',
          'Microsoft YaHei',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif',
        ],
        article: [
          'Songti SC',
          'Noto Serif SC',
          'Source Han Serif SC',
          'STSong',
          'Georgia',
          'Cambria',
          'Times New Roman',
          'serif',
        ],
        mono: [
          'SF Mono',
          'JetBrains Mono',
          'Menlo',
          'Consolas',
          'Liberation Mono',
          'monospace',
        ],
        ui: [
          'PingFang SC',
          'Hiragino Sans GB',
          'Noto Sans SC',
          'Microsoft YaHei',
          'system-ui',
          '-apple-system',
          'sans-serif',
        ],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1.35' }],
        sm: ['0.875rem', { lineHeight: '1.45' }],
        base: ['1rem', { lineHeight: '1.6' }],
        lg: ['1.125rem', { lineHeight: '1.55' }],
        xl: ['1.25rem', { lineHeight: '1.45' }],
        '2xl': ['1.5rem', { lineHeight: '1.35' }],
        '3xl': ['1.875rem', { lineHeight: '1.28' }],
        '4xl': ['2.25rem', { lineHeight: '1.22' }],
        '5xl': ['2.75rem', { lineHeight: '1.15' }],
      },
      fontWeight: {
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
        black: '900',
      },
      letterSpacing: {
        tight: '-0.02em',
        wide: '0.025em',
        wider: '0.05em',
        widest: '0.08em',
      },
      lineHeight: {
        tight: '1.25',
        normal: '1.6',
        relaxed: '1.8',
      },
      spacing: {
        18: '4.5rem',
        88: '22rem',
      },
      maxWidth: {
        reading: '68ch',
        prose: '72ch',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      boxShadow: {
        reading: '0 2px 10px rgba(30, 36, 43, 0.06)',
        card: '0 4px 12px -2px rgba(30, 36, 43, 0.08), 0 2px 4px -1px rgba(30, 36, 43, 0.04)',
        elevated:
          '0 10px 18px -4px rgba(30, 36, 43, 0.1), 0 4px 6px -2px rgba(30, 36, 43, 0.05)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
