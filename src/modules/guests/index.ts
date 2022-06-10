import { router } from '~/router';
router.addRoute('DefaultLayout', {
  name: 'Guests',
  path: '/guests',
  component: () => import('./view.vue'),
  meta: {
    pathActive: 'guests',
    parentActive: '',
  },
});
