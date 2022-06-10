import { router } from '~/router';
router.addRoute('DefaultLayout', {
  name: 'ShiftHandoverReport',
  path: '/report/shift-handover-report',
  component: () => import('./view.vue'),
  meta: { parentActive: '/report' },
});
