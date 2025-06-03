// @ts-check
import { defineConfig, envField } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import icon from "astro-icon";
import react from "@astrojs/react";
import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [icon(), react()],
  output: "server",
  adapter: vercel(),
  env: {
    schema: {
      TURSO_TOKEN: envField.string({
        context: "server",
        access: "secret",
      }),
      TURSO_URL: envField.string({
        context: "server",
        access: "secret",
      }),
    },
  },
});
