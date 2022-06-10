import type { RouteRecordRaw } from 'vue-router';

export const permissionModuleRoutes: RouteRecordRaw[] = [
  {
    name: 'permission',
    path: '/permission',
    component: () => import('./view.vue'),
    meta: {
      pathActive: '/settings/staff',
    },
  },
];
