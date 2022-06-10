import { router } from '~/router';
router.addRoute('DefaultLayout', {
  name: 'Cashiering',
  path: '/settings/cashiering',
  component: () => import('./view.vue'),
  meta: { pathActive: '', parentActive: '/setting' },
});
