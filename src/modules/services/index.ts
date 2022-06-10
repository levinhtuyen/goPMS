import { router } from '~/router';
router.addRoute('DefaultLayout', {
  name: 'Services',
  path: '/services',
  component: () => import('./view.vue'),
  meta: {
    parentActive: '/inventory',
  },
});
