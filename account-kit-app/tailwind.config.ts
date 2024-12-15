/** @type {import('tailwindcss').Config} */
import { createColorSet, withAccountKitUi } from "@account-kit/react/tailwind";
import { withUt } from "uploadthing/tw";

const config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  colors: {
    "btn-primary": createColorSet("#E82594", "#FF66CC"),
    "fg-accent-brand": createColorSet("#E82594", "#FF66CC"),
  },
  plugins: [],
};

export default withUt(withAccountKitUi(config));
