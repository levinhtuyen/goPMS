import { router } from '~/router';
router.addRoute('DefaultLayout', {
  name: 'revenue-report',
  path: '/report/revenue-report',
  component: () => import('./view.vue'),
  meta: { pathActive: '', parentActive: '/report' },
});
