import type { RouteRecordRaw } from 'vue-router';

export const profileModuleRoutes: RouteRecordRaw[] = [
  {
    name: 'Profile',
    path: '/profile',
    component: () => import('./view.vue'),
  },
];
