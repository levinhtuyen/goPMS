import { router } from '~/router';
router.addRoute('DefaultLayout', {
  name: 'ShiftHandover',
  path: '/shift-handover',
  component: () => import('./view.vue'),
  meta: { activePath: '/shift-handover' },
});
