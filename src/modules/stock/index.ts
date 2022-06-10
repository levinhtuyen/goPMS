import { router } from '~/router';

router.addRoute('DefaultLayout', {
  name: 'Stock-Management',
  path: '/settings/stock',
  redirect: '/settings/stock/import',
  component: () => import('./view.vue'),
  children: [
    {
      name: 'StockImportManagement',
      path: '/settings/stock/import',
      component: () => import('./import/view.vue'),
      meta: {
        pathActive: '/settings/stock',
        parentActive: '/inventory',
      },
    },
    {
      name: 'StockExportManagement',
      path: '/settings/stock/export',
      component: () => import('./export/pages/index.vue'),
      meta: {
        pathActive: '/settings/stock',
        parentActive: '/inventory',
      },
      children: [
        {
          name: 'StockExportManagementDetail',
          path: '/settings/stock/export/:stockSn',
          component: () => import('./export/pages/detail.vue'),
        },
      ],
    },
    {
      name: 'StockInventoryManagement',
      path: '/settings/stock/inventory',
      component: () => import('./inventory/pages/index.vue'),
      meta: {
        pathActive: '/settings/stock',
        parentActive: '/inventory',
      },
      children: [
        {
          name: 'StockInventoryManagementDetail',
          path: '/settings/stock/inventory/:productSn',
          component: () => import('./inventory/pages/detail.vue'),
        },
      ],
    },
  ],
});
