import { router } from '~/router';
router.addRoute('DefaultLayout', {
  name: 'HotelActivitiesLog',
  path: '/report/hotel-activities-log',
  component: () => import('./view.vue'),
  meta: { parentActive: '/report' },
});
