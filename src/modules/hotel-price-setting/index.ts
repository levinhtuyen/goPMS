import type { RouteRecordRaw } from 'vue-router';

export const hotelPriceModuleRoutes: RouteRecordRaw[] = [
  {
    name: 'HotelPriceSetting',
    path: '/settings/hotel-price-setting',
    component: () => import('./view.vue'),
    meta: {
      pathActive: '/settings/hotel-price-setting',
      parentActive: '/setting',
    },
  },
];
