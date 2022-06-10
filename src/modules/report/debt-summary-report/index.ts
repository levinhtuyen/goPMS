import { router } from '~/router';
router.addRoute('DefaultLayout', {
  name: 'debt-summary-report',
  path: '/report/debt-summary-report',
  component: () => import('./view.vue'),
  meta: { pathActive: '', parentActive: '/report' },
});
