/** @type {import('tailwindcss').Config} */

export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                app: ["Raleway", "sans-serif"],
            },
            colors: {
                primary: "var(--clr)",
                secondary: "var(--second-text)",
                header: "var(--header-text)",
                border: "var(--border-clr)",
                "divide-line": "var(--divide-line-clr)",
                "input-text": "var(--input-text-clr)",
                "placeholder-text": "var(--placeholder-text-clr)",
                "input-border": "var(--input-border-clr)",
            },
            backgroundColor: {
                primary: "var(--bg-clr)",
                card: "var(--container-bg-clr)",
                header: "var(--header-bg-clr)",
                input: "var(--input-bg-clr)",
            },
        },
    },
    plugins: [],
    darkMode: "class",
};
