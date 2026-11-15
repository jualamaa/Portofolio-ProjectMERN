/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                brand: {
                    dark: '#17191C',
                    light: '#F2F0EA',
                    gray: '#A5A39D',
                    olive: '#657568',
                    stone: '#D9D4C9',
                    textDark: '#242629',
                    textLight: '#F2F0EA',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['Manrope', 'Inter', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
        },
    },
    plugins: [],
};