/** @type {import('tailwindcss').Config} */
/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['"SF Pro Display"', '"SF Pro Text"', 'system-ui', 'sans-serif'],
            },
            colors: {
                // Apple-inspired system grays (Dark Mode)
                system: {
                    bg: '#000000',
                    gray1: '#1C1C1E',
                    gray2: '#2C2C2E',
                    gray3: '#3A3A3C',
                    gray4: '#48484A',
                    gray5: '#636366',
                    gray6: '#8E8E93',
                },
                // Accent colors
                accent: {
                    blue: '#0A84FF',
                    red: '#FF453A',
                    green: '#30D158',
                    indigo: '#5E5CE6',
                    orange: '#FF9F0A',
                    pink: '#FF375F',
                    purple: '#BF5AF2',
                    teal: '#64D2FF',
                    yellow: '#FFD60A',
                },
                grid: {
                    base: '#000000',
                    cell: 'rgba(255, 255, 255, 0.05)',
                    highlight: '#64D2FF',
                    locked: '#FF453A',
                    valid: '#30D158',
                }
            },
            backdropBlur: {
                xs: '2px',
            }
        },
    },
    plugins: [],
}
