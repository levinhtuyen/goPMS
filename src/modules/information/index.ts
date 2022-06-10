import { router } from '~/router';
router.addRoute('DefaultLayout', {
  name: 'Information',
  path: '/settings/information',
  component: () => import('./view.vue'),
  meta: { pathActive: '', parentActive: '/setting' },
});
