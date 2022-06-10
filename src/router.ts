import type { RouteRecordRaw } from 'vue-router';
import { createRouter, createWebHistory } from 'vue-router';
import { authModuleRoutes } from './modules/auth';
import { profileModuleRoutes } from './modules/profile';
import { roomSettingsModuleRoutes } from './modules/room-settings';
import { hotelPriceModuleRoutes } from './modules/hotel-price-setting';
import { permissionModuleRoutes } from './modules/role-permission';
import { signUpModuleRoutes } from './modules/sign-up';

const routes: RouteRecordRaw[] = [
  ...authModuleRoutes,
  ...signUpModuleRoutes,
  {
    path: '/',
    name: 'DefaultLayout',
    redirect: '/dashboard',
    component: () => import('~/layouts/default.vue'),
    children: [
      ...profileModuleRoutes,
      ...roomSettingsModuleRoutes,
      ...hotelPriceModuleRoutes,
      ...permissionModuleRoutes,
      {
        path: '/guests/:page?/:id?',
        name: 'Guests',
        component: () => import('./modules/guests/view.vue'),
      },
    ],
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('access_token');
  if (token && to.name === 'SignIn') {
    next({ name: 'DefaultLayout' });
  } else if (!token && to.name !== 'SignIn' && to.name !== 'SignUp') {
    next({ name: 'SignIn' });
  } else {
    next();
  }
});
