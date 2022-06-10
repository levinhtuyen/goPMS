import { router } from '~/router';
router.addRoute('DefaultLayout', {
  name: 'Timeline',
  path: '/time-line',
  component: () => import('./view.vue'),
  meta: {
    pathActive: '/room-view',
  },
});
