import { router } from '~/router';
router.addRoute('DefaultLayout', {
  name: 'debt-detail-report',
  path: '/report/debt-detail-report/:sn',
  component: () => import('./view.vue'),
  meta: { pathActive: '/report/debt-summary-report', parentActive: '/report' },
});
