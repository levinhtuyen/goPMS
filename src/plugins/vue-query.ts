import type { VueQueryPluginOptions } from 'vue-query';
export { VueQueryPlugin } from 'vue-query';

export const vueQueryOptions: VueQueryPluginOptions = {
  queryClientConfig: {
    defaultOptions: { queries: { refetchOnWindowFocus: false } },
  },
};
