import { router } from '~/router';
router.addRoute('DefaultLayout', {
  name: 'CashProfitReport',
  path: '/report/cash-profit-report',
  component: () => import('./view.vue'),
  meta: { parentActive: '/report' },
});
