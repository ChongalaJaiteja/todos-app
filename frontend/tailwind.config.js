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
                appTheme: {
                    DEFAULT: "#ef4444",
                    50: "#fee2e2",
                    100: "#fecaca",
                    200: "#fca5a5",
                    300: "#f87171",
                    400: "#f44747",
                    500: "#ef4444",
                    600: "#dc2626",
                    700: "#b91c1c",
                    800: "#991b1b",
                    900: "#7f1d1d",
                },
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
