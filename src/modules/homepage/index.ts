import { router } from '~/router';
router.addRoute('DefaultLayout', {
  name: 'Homepage',
  path: '/homepage',
  component: () => import('./view.vue'),
});
