import { defineConfig } from 'astro/config';

export default defineConfig({
	site: 'http://localhost:2222',
	output: 'static',
	vite: {
    build: {
      assetsInlineLimit(filePath) {
        return filePath.endsWith('css');
      },
    },
  },
});
