import { router } from '~/router';
router.addRoute('DefaultLayout', {
  name: 'statistics-report',
  path: '/statistics-report',
  component: () => import('./view.vue'),
  meta: { pathActive: '/statistics-report' },
});
