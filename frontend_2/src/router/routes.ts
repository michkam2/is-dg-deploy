import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: '/devices',
      },
      {
        path: '/account',
        component: () => import('pages/account/AccountTabsPage.vue'),
        children: [
          {
            path: '',
            component: () => import('pages/account/AccountEditPage.vue'),
          },
        ],
      },
      {
        path: 'user-management',
        component: () => import('pages/account/UserManagementPage.vue'),
        meta: { requiresAdmin: true },
      },
      {
        path: 'user-management/:id',
        component: () => import('pages/account/UserManagementEditPage.vue'),
        meta: { requiresAdmin: true },
      },
      {
        path: '/devices',
        component: () => import('pages/devices/DevicesPage.vue'),
      },
      {
        path: '/devices/create',
        component: () => import('pages/devices/CreateDevicePage.vue'),
        meta: { requiresAdmin: true },
      },
      {
        path: '/devices/:id',
        component: () => import('pages/devices/DeviceDetailPage.vue'),
      },
      {
        path: '/devices/:id/jobs',
        component: () => import('pages/jobs/JobsOnDevicePage.vue'),
      },
      {
        path: '/devices/:id/edit',
        component: () => import('pages/devices/UpdateDevicePage.vue'),
        meta: { requiresAdmin: true },
      },
      {
        path: '/jobs',
        component: () => import('pages/jobs/AllJobsPage.vue'),
      },
      {
        path: '/jobs/:id/',
        component: () => import('pages/jobs/JobDetailPage.vue'),
      },
      {
        path: '/commands',
        component: () => import('pages/commands/CommandsPage.vue'),
      },
      {
        path: '/recipes',
        component: () => import('pages/recipes/RecipesPage.vue'),
      },
      {
        path: '/recipes/create',
        component: () => import('pages/recipes/CreateRecipePage.vue'),
      },
      {
        path: '/recipes/:id/edit',
        component: () => import('pages/recipes/UpdateRecipePage.vue'),
      },
      {
        path: '/collections',
        component: () => import('pages/collections/CollectionsPage.vue'),
      },
      {
        path: '/collections/:id/',
        component: () => import('pages/collections/CollectionDetailPage.vue'),
      },
      {
        path: '/modules/:id/',
        component: () => import('pages/modules/ModuleDetailPage.vue'),
      },
      {
        path: '/scenarios',
        component: () => import('pages/scenarios/ScenariosPage.vue'),
      },
      {
        path: '/scenarios/create',
        component: () => import('pages/scenarios/CreateScenarioPage.vue'),
      },
    ],
  },
  {
    path: '/login',
    component: () => import('pages/auth/LoginPage.vue'),
  },
  {
    path: '/register',
    component: () => import('pages/auth/RegisterPage.vue'),
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
