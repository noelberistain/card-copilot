/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    /** PODRIAN NO HACER FALTA */
    // './app/**/*.{js,jsx,ts,tsx}',
    // './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#0D9488",
        "primary-muted": "#CCFBF1",
        surface: "#FAFAFA",
        "surface-muted": "#F1F2F6",
        ink: "#15161B",
        "ink-muted": "#64748B",
        success: "#16A34A",
        warning: "#D97706",
        danger: "#DC2626",
      },
      fontFamily: {
        sans: ["Inter_400Regular"],
        "sans-medium": ["Inter_500Medium"],
        "sans-semibold": ["Inter_600SemiBold"],
        display: ["PlusJakartaSans_600SemiBold"],
        "display-bold": ["PlusJakartaSans_700Bold"],
        "display-extrabold": ["PlusJakartaSans_800ExtraBold"],
      },
    },
  },
  plugins: [],
};
