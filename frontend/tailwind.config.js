/** @type {import('tailwindcss').Config} */
import fluid, { extract, screens, fontSize } from "fluid-tailwind";

export default {
    content: {
        files: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
        extract,
    },
    theme: {
        extend: {
            fontFamily: {
                app: ["Raleway", "sans-serif"],
            },
            colors: {
                appTheme: "bg-red-500",
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
        screens,
        fontSize,
    },
    plugins: [
        fluid({
            checkSC144: false,
        }),
    ],
    darkMode: "class",
};
