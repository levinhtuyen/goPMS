import type { QuasarPluginOptions } from 'quasar';
import { Notify, Dialog, Loading } from 'quasar';
import { setCssVar } from 'quasar';
setCssVar('negative', '#FF6400');
setCssVar('red-10', '#C10015');

export const quasarOptions: Partial<QuasarPluginOptions> = { plugins: { Notify, Dialog, Loading } };
