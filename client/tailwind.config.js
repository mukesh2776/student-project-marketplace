/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Light theme surface colors
                surface: {
                    50: '#f8fafc',
                    100: '#f1f5f9',
                    200: '#e2e8f0',
                    300: '#cbd5e1',
                },
                // Primary gradient colors
                primary: {
                    50: '#f5f3ff',
                    100: '#ede9fe',
                    200: '#ddd6fe',
                    300: '#c4b5fd',
                    400: '#818cf8',
                    500: '#7c3aed',
                    600: '#6d28d9',
                    700: '#5b21b6',
                },
                // Accent colors
                accent: {
                    cyan: '#0891b2',
                    purple: '#7c3aed',
                    pink: '#ec4899',
                    green: '#10b981',
                    orange: '#f59e0b',
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-primary': 'linear-gradient(135deg, #7c3aed 0%, #0891b2 100%)',
            },
            boxShadow: {
                'glow': '0 4px 14px rgba(124, 58, 237, 0.25)',
                'card': '0 1px 3px rgba(0, 0, 0, 0.08), 0 4px 14px rgba(0, 0, 0, 0.04)',
                'card-hover': '0 8px 30px rgba(0, 0, 0, 0.1)',
                'nav': '0 1px 3px rgba(0, 0, 0, 0.06)',
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'pulse-slow': 'pulse 3s ease-in-out infinite',
                'gradient': 'gradient 8s ease infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                gradient: {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                }
            }
        },
    },
    plugins: [],
}
