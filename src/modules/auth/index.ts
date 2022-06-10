import type { RouteRecordRaw } from 'vue-router';

export const authModuleRoutes: RouteRecordRaw[] = [
  {
    name: 'SignIn',
    path: '/sign-in',
    component: () => import('./view.vue'),
  },
];
