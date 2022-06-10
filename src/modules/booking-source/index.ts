import { router } from '~/router';
router.addRoute('DefaultLayout', {
  name: 'BookingSource',
  path: '/settings/booking-sources',
  component: () => import('./view.vue'),
  meta: {
    pathActive: '/settings/booking-sources',
    parentActive: '/setting',
  },
});
