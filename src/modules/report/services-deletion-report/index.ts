import { router } from '~/router';
router.addRoute('DefaultLayout', {
  name: 'services-deletion-report',
  path: '/report/services-deletion-report',
  component: () => import('./view.vue'),
  meta: { pathActive: '', parentActive: '/report' },
});
