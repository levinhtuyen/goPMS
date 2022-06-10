import { App } from 'vue';
import PmsSections from './pms-sections.vue';
const comps = [PmsSections];
const install = (app: App): void => {
  comps.forEach((comp) => {
    app.component(comp.name, comp);
  });
};
export default {
  install,
};
