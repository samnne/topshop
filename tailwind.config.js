/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors")
module.exports = {
    content: [
        "./views/**/*.ejs",
        "./public/**/*.js"
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    100: '#f5e9e6',
                    200: '#ebd3cc',
                    300: '#e1bdb3',
                    400: '#d7a799',
                    500: '#cd9180',
                    600: '#c37b66',
                    700: '#b9654d',
                    800: '#af4f33',
                    900: '#a5391a',
                },
                secondary: {
                    100: '#f5f2ed',
                    200: '#ebe5db',
                    300: '#e1d8c9',
                    400: '#d7cbb7',
                    500: '#cdbea5',
                    600: '#c3b193',
                    700: '#b9a481',
                    800: '#af976f',
                    900: '#a58a5d',
                },
                accent: {
                    100: '#f5f2e6',
                    200: '#ebe5cc',
                    300: '#e1d8b3',
                    400: '#d7cb99',
                    500: '#cdbe80',
                    600: '#c3b166',
                    700: '#b9a44d',
                    800: '#af9733',
                    900: '#a58a1a',
                },
                textMain: {
                    100: '#e6e5e5',
                    200: '#cccaca',
                    300: '#b3b0b0',
                    400: '#999595',
                    500: '#807b7b',
                    600: '#666060',
                    700: '#4d4646',
                    800: '#332b2b',
                    900: '#1a1010',
                },
                background: {
                    100: '#fefdfd',
                    200: '#fdfbfb',
                    300: '#fcf9f9',
                    400: '#fbf7f7',
                    500: '#faf5f5',
                    600: '#f9f3f3',
                    700: '#f8f1f1',
                    800: '#f7efef',
                    900: '#f6eded',
                },
            }
        },
    },
    plugins: [],
}