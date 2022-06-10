import { router } from '~/router';
router.addRoute('DefaultLayout', {
  name: 'Dashboard',
  path: '/dashboard',
  component: () => import('./view.vue'),
});
