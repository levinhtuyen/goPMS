import { router } from '~/router';
router.addRoute('DefaultLayout', {
  name: 'CashTransactions',
  path: '/settings/cash-transactions',
  component: () => import('./view.vue'),
  meta: { activePath: '/settings/cash-transactions' },
});
