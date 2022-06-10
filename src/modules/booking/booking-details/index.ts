import { router } from '~/router';
router.addRoute('DefaultLayout', {
  name: 'BookingDetails',
  path: '/booking-details/:sn',
  component: () => import('./view.vue'),
  meta: { pathActive: '/room-view' },
});
