import type { RouteRecordRaw } from 'vue-router';

export const signUpModuleRoutes: RouteRecordRaw[] = [
  {
    name: 'SignUp',
    path: '/sign-up',
    component: () => import('./view.vue'),
  },
];
