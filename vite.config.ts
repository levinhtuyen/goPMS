import vueI18n from '@intlify/vite-plugin-vue-i18n';
import { quasar, transformAssetUrls } from '@quasar/vite-plugin';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '~': resolve(__dirname, 'src'),
      '@': resolve(__dirname, 'src'),
    },
  },
  plugins: [
    vue({ template: { transformAssetUrls } }),
    quasar({
      sassVariables: 'src/styles/quasar-variables.sass',
    }),
    vueI18n({ include: 'locales/**' }),
  ],
  // eslint-disable-next-line
  // @ts-ignore
  test: {
    globals: true,
    environment: 'jsdom',
  },
});
