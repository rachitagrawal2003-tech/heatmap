/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                cozy: {
                    bg: '#1c1917', // Warm dark
                    text: '#f5f5f4', // Off-white
                    base: '#292524', // Slightly lighter dark
                    primary: '#e11d48', // Rose-600 logic, adjust later
                    secondary: '#fb7185', // Rose-400
                    accent: '#fda4af', // Rose-300
                },
                fontFamily: {
                    sans: ['Nunito', 'ui-sans-serif', 'system-ui', 'sans-serif'],
                }
            }
        },
    },
    plugins: [],
}
