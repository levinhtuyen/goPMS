import { router } from '~/router';
router.addRoute('DefaultLayout', {
  name: 'Policies',
  path: '/settings/policies',
  component: () => import('./view.vue'),
  meta: { pathActive: '', parentActive: '/setting' },
});
