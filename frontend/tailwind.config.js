/** @type {import('tailwindcss').Config} */
// Colors reference CSS variables defined in src/styles/tokens.css so light/dark
// themes swap automatically. Semantic names: `brand` = oxblood, `reward` = brass.
const v = (name) => `var(--${name})`;

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        bg: v('bg'),
        surface: v('surface'),
        'surface-2': v('surface-2'),
        sidebar: v('sidebar'),
        'sidebar-2': v('sidebar-2'),
        text: v('text'),
        dim: v('dim'),
        faint: v('faint'),
        heading: v('heading'),
        brand: v('brand'),
        'brand-soft': v('brand-soft'),
        reward: v('reward'),
        'reward-soft': v('reward-soft'),
        border: v('border'),
        'border-2': v('border-2'),
        'on-side': v('on-side'),
        'on-side-dim': v('on-side-dim'),
        st: {
          none: v('st-none'),
          prog: v('st-prog'),
          over: v('st-over'),
          done: v('st-done'),
          late: v('st-late'),
          'none-bg': v('st-none-bg'),
          'prog-bg': v('st-prog-bg'),
          'over-bg': v('st-over-bg'),
          'done-bg': v('st-done-bg'),
          'late-bg': v('st-late-bg'),
        },
      },
      fontFamily: {
        serif: ['"Source Serif 4"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '16px',
        btn: '12px',
      },
      boxShadow: {
        soft: 'var(--shadow-lg)',
      },
      keyframes: {
        sbFade: {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to: { opacity: '1', transform: 'none' },
        },
        sbPop: {
          '0%': { transform: 'scale(.94)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        sbShimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
        sbConfetti: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '10%': { opacity: '1' },
          '100%': { transform: 'translateY(120px)', opacity: '0' },
        },
      },
      animation: {
        fade: 'sbFade .4s cubic-bezier(.4,0,.2,1) both',
        pop: 'sbPop .3s cubic-bezier(.34,1.56,.64,1) both',
      },
    },
  },
  plugins: [],
};
