/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue"
  ],
  theme: {
    extend: {
      colors: {
        'neo-bg': '#0f172a',
        'neo-grid': '#1e293b',
        'neo-blue': '#38bdf8',
        'neo-red': '#ef4444',
        'neo-purple': '#a855f7',
        'neo-gray': '#64748b'
      }
    },
  },
  plugins: [],
}
