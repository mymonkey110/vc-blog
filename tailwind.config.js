/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ['class'],
    content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
  	extend: {
  		colors: {
  			'primary-text': '#1a1a1a',
  			'secondary-text': '#666666',
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			background: 'hsl(var(--background))',
  			surface: '#f8f9fa',
  			border: 'hsl(var(--border))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		fontFamily: {
			heading: [
				'Georgia',
				'Times New Roman',
				'宋体',
				'SimSun',
				'华文宋体',
				'STSong',
				'serif'
			],
			body: [
				'SF Pro Text',
				'Helvetica Neue',
				'Helvetica',
				'Arial',
				'PingFang SC',
				'Hiragino Sans GB',
				'Microsoft YaHei',
				'微软雅黑',
				'WenQuanYi Micro Hei',
				'sans-serif'
			],
			article: [
				'SF Pro Text',
				'Helvetica Neue',
				'Helvetica',
				'Arial',
				'PingFang SC',
				'Hiragino Sans GB',
				'Microsoft YaHei',
				'微软雅黑',
				'WenQuanYi Micro Hei',
				'sans-serif'
			],
			mono: [
				'SF Mono',
				'Monaco',
				'Inconsolata',
				'Roboto Mono',
				'Source Code Pro',
				'Menlo',
				'Consolas',
				'Courier New',
				'monospace'
			],
			ui: [
				'SF Pro Display',
				'Helvetica Neue',
				'Helvetica',
				'Arial',
				'PingFang SC',
				'Hiragino Sans GB',
				'Microsoft YaHei',
				'微软雅黑',
				'system-ui',
  				'-apple-system',
  				'sans-serif'
  			]
  		},
  		fontSize: {
  			xs: [
  				'0.75rem',
  				{
  					lineHeight: '1.25'
  				}
  			],
  			sm: [
  				'0.875rem',
  				{
  					lineHeight: '1.4'
  				}
  			],
  			base: [
  				'1rem',
  				{
  					lineHeight: '1.5'
  				}
  			],
  			lg: [
  				'1.125rem',
  				{
  					lineHeight: '1.5'
  				}
  			],
  			xl: [
  				'1.25rem',
  				{
  					lineHeight: '1.5'
  				}
  			],
  			'2xl': [
  				'1.5rem',
  				{
  					lineHeight: '1.4'
  				}
  			],
  			'3xl': [
  				'1.875rem',
  				{
  					lineHeight: '1.3'
  				}
  			],
  			'4xl': [
  				'2.25rem',
  				{
  					lineHeight: '1.2'
  				}
  			],
  			'5xl': [
  				'3rem',
  				{
  					lineHeight: '1.1'
  				}
  			]
  		},
  		fontWeight: {
  			light: '300',
  			normal: '400',
  			medium: '500',
  			semibold: '600',
  			bold: '700',
  			extrabold: '800',
  			black: '900'
  		},
  		letterSpacing: {
  			tight: '-0.025em',
  			wide: '0.025em',
  			wider: '0.05em',
  			widest: '0.1em'
  		},
  		lineHeight: {
  			tight: '1.25',
  			normal: '1.5',
  			relaxed: '1.75'
  		},
  		spacing: {
  			'18': '4.5rem',
  			'88': '22rem'
  		},
  		maxWidth: {
  			reading: '65ch',
  			prose: '72ch'
  		},
  		animation: {
  			'fade-in': 'fadeIn 0.5s ease-in-out',
  			'slide-up': 'slideUp 0.3s ease-out'
  		},
  		keyframes: {
  			fadeIn: {
  				'0%': {
  					opacity: '0'
  				},
  				'100%': {
  					opacity: '1'
  				}
  			},
  			slideUp: {
  				'0%': {
  					transform: 'translateY(10px)',
  					opacity: '0'
  				},
  				'100%': {
  					transform: 'translateY(0)',
  					opacity: '1'
  				}
  			}
  		},
  		boxShadow: {
  			reading: '0 2px 8px rgba(0, 0, 0, 0.06)',
  			card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  			elevated: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};