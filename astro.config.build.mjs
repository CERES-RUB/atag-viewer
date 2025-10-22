import { defineConfig } from 'astro/config';

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  base: 'atag-viewer',
  buildOptions: {
    site: 'https://ceres-rub.github.io/atag-viewer/',
  }
});