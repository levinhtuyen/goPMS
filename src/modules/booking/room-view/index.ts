import { router } from '~/router';
router.addRoute('DefaultLayout', {
  name: 'RoomView',
  path: '/room-view',
  component: () => import('./view.vue'),
  meta: {
    pathActive: '/room-view',
  },
});
