import { router } from '~/router';
router.addRoute('DefaultLayout', {
  name: 'Bookings',
  path: '/bookings',
  component: () => import('./view.vue'),
});
