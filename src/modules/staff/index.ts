import { router } from '~/router';
router.addRoute('DefaultLayout', {
  name: 'Staff',
  path: '/settings/staff',
  component: () => import('./view.vue'),
  meta: { activePath: '/settings/staff' },
});
