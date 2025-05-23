import plugin from "tailwindcss/plugin";

export const shadcnPlugin = plugin(function ({ addBase }) {
  addBase({
    ":root": {
      "--background": "0 0% 100%",
      "--foreground": "240 10% 3.9%",
      "--primary": "240 5.9% 10%",
      "--primary-foreground": "0 0% 98%",
    },
  });
});
