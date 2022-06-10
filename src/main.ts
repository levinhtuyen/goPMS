import { Quasar } from 'quasar';
import { createApp } from 'vue';
import App from '~/App.vue';
import { i18n } from '~/plugins/i18n';
import emit from './plugins/emitt';
import { quasarOptions } from '~/plugins/quasar';
import { VueQueryPlugin, vueQueryOptions } from '~/plugins/vue-query';
import { router } from '~/router';
import './modules';

// Import global component
import PmsComponents from '~/components/globals';
// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css';

// Import Quasar css
import 'quasar/src/css/index.sass';
// Import main css
import './assets/styles/main.scss';
createApp(App)
  .use(router)
  .use(Quasar, quasarOptions)
  .use(i18n)
  .use(emit)
  .use(VueQueryPlugin, vueQueryOptions)
  .use(PmsComponents)
  .mount('#app');
