import type { RouteRecordRaw } from 'vue-router';

export const roomSettingsModuleRoutes: RouteRecordRaw[] = [
  {
    name: 'Settings-RoomSettings',
    path: '/settings/room-settings',
    component: () => import('./views/index.vue'),
    meta: { parentActive: '/setting' },
    children: [
      {
        path: 'room-types/:roomTypeSn',
        component: () => import('./views/room-types.vue'),
      },
      {
        path: 'rooms/:roomSn',
        component: () => import('./views/rooms.vue'),
      },
    ],
  },
];
