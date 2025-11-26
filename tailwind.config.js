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
                sans: [
                    '-apple-system',
                    'BlinkMacSystemFont',
                    '"SF Pro Text"',
                    '"Segoe UI"',
                    'Roboto',
                    'Helvetica',
                    'Arial',
                    'sans-serif',
                ],
                display: [
                    '-apple-system',
                    'BlinkMacSystemFont',
                    '"SF Pro Display"',
                    '"Segoe UI"',
                    'Roboto',
                    'Helvetica',
                    'Arial',
                    'sans-serif',
                ],
                mono: [
                    'ui-monospace',
                    'SFMono-Regular',
                    'Menlo',
                    'Monaco',
                    'Consolas',
                    '"Liberation Mono"',
                    '"Courier New"',
                    'monospace',
                ],
            },
            colors: {
                // Apple HIG System Colors (Dark Mode default)
                system: {
                    // Backgrounds
                    background: {
                        primary: '#000000',
                        secondary: '#1C1C1E',
                        tertiary: '#2C2C2E',
                    },
                    // Labels (Text)
                    label: {
                        primary: '#FFFFFF',
                        secondary: 'rgba(235, 235, 245, 0.60)',
                        tertiary: 'rgba(235, 235, 245, 0.30)',
                        quaternary: 'rgba(235, 235, 245, 0.18)',
                    },
                    // Fills
                    fill: {
                        primary: 'rgba(120, 120, 128, 0.36)',
                        secondary: 'rgba(120, 120, 128, 0.32)',
                        tertiary: 'rgba(118, 118, 128, 0.24)',
                        quaternary: 'rgba(116, 116, 128, 0.18)',
                    },
                    // Separators
                    separator: {
                        DEFAULT: 'rgba(84, 84, 88, 0.65)', // Opaque separator
                        nonOpaque: 'rgba(84, 84, 88, 0.65)',
                    },
                    // Materials (for backdrop-filter)
                    material: {
                        thick: 'rgba(30, 30, 30, 0.75)',
                        regular: 'rgba(30, 30, 30, 0.70)',
                        thin: 'rgba(30, 30, 30, 0.60)',
                        ultrathin: 'rgba(30, 30, 30, 0.45)',
                    }
                },
                // Semantic Action Colors
                accent: {
                    blue: '#0A84FF',   // iOS System Blue Dark
                    red: '#FF453A',    // iOS System Red Dark
                    green: '#30D158',  // iOS System Green Dark
                    indigo: '#5E5CE6', // iOS System Indigo Dark
                    orange: '#FF9F0A', // iOS System Orange Dark
                    pink: '#FF375F',   // iOS System Pink Dark
                    purple: '#BF5AF2', // iOS System Purple Dark
                    teal: '#64D2FF',   // iOS System Teal Dark
                    yellow: '#FFD60A', // iOS System Yellow Dark
                    gray: '#8E8E93',   // iOS System Gray Dark
                },
                // Game Specific Semantic Colors
                grid: {
                    base: '#000000',
                    cell: 'rgba(255, 255, 255, 0.05)',
                    highlight: '#64D2FF',
                    locked: '#FF453A',
                    valid: '#30D158',
                }
            },
            borderRadius: {
                '4xl': '2rem', // 32px
                '5xl': '2.5rem', // 40px
            },
            backdropBlur: {
                xs: '2px',
                md: '10px', // Regular material
                lg: '20px', // Thick material
                xl: '30px', // Ultra thick
            }
        },
    },
    plugins: [],
}
