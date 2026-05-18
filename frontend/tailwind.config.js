/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Classic Magical Library Theme - Light Mode
        cream: {
          50: '#fffdf5',     // Lightest cream
          100: '#fff9e6',   // Very light cream
          200: '#fff4ce',    // Light cream (gold-100)
          300: '#ffefb8',   // Soft cream
          400: '#f5e6c8',    // Warm cream
        },
        royal: {
          900: '#001428',   // Deepest navy - for text
          800: '#001e3d',   // Dark navy - for headings
          700: '#002b52',   // Navy - for accents
          600: '#003b72',   // Medium-dark blue - for hover states
        },
        gold: {
          100: '#fff4ce',    // Lightest gold
          200: '#ffe7a3',   // Light gold
          300: '#ffd078',    // Gold
          400: '#d0b778',    // Primary gold accent
          500: '#b89960',    // Darker gold
          600: '#8b7355',    // Muted gold
        },
        magical: {
          teal: '#005580',   // Darker teal for contrast on light
          cyan: '#0088aa',   // Medium cyan
          purple: '#4a1d6e', // Dark purple for contrast
        },
        classic: {
          dark: '#1b2938',   // Card/surface dark
          surface: '#fff9e6',// Light cream surface
          text: '#1b2938',   // Dark text for readability
        },
        // Fallback aliases
        primary: '#4F46E5',
        secondary: '#10B981',
        accent: '#F59E0B',
        dark: '#1F2937',
        light: '#F3F4F6'
      },
      fontFamily: {
        'cinzel': ['Cinzel', 'serif'],
        'cinzel-decorative': ['Cinzel Decorative', 'serif'],
        'serif': ['Georgia', 'Times New Roman', 'serif'],
      },
      backgroundImage: {
        'royal-gradient': 'linear-gradient(135deg, rgba(0, 20, 38, 0.95), rgba(0, 87, 163, 0.6))',
        'gold-gradient': 'linear-gradient(135deg, #d0b778, #b89960)',
        'magical-glow': 'radial-gradient(circle, rgba(0, 204, 255, 0.3) 0%, transparent 70%)',
      },
      boxShadow: {
        'gold': '0 0 15px rgba(208, 183, 120, 0.4)',
        'magical': '0 0 20px rgba(0, 204, 255, 0.3)',
        'classic': '0 4px 20px rgba(0, 0, 0, 0.4)',
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 10px rgba(208, 183, 120, 0.3)' },
          '100%': { boxShadow: '0 0 25px rgba(208, 183, 120, 0.6)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}