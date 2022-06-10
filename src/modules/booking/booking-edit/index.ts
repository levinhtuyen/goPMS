import { router } from '~/router';
router.addRoute('DefaultLayout', {
  name: 'BookingEdit',
  path: '/booking-edit/:sn',
  component: () => import('./view.vue'),
  meta: { pathActive: '/room-view' },
});
