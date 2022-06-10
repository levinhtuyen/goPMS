import { router } from '~/router';
router.addRoute('DefaultLayout', {
  name: 'change-room-report',
  path: '/report/change-room-report',
  component: () => import('./view.vue'),
  meta: { pathActive: '', parentActive: '/report' },
});
