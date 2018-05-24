import Vue from 'vue';
import Router from 'vue-router';
import modules from '@/modules';
import ErrorPage from '@/components/layout/ErrorPage';

Vue.use(Router);

const routes = [{
  path: '/error',
  name: 'error',
  component: ErrorPage,
}];
Object.keys(modules).forEach((moduleName) => {
  const pageModule = modules[moduleName];

  if (pageModule.path && pageModule.component) {
    routes.push({
      path: `/${pageModule.path}`,
      name: `${pageModule.displayNameKey}.module_name`,
      component: pageModule.component,
    });
  }

  if (!pageModule.pages) {
    return;
  }
  Object.keys(pageModule.pages).forEach((pageName) => {
    const page = pageModule.pages[pageName];
    routes.push({
      path: `/${pageModule.pages[pageName].path}`,
      name: `${pageModule.displayNameKey}.${page.displayNameKey}`,
      component: page,
    });
  });
});

const router = new Router({
  routes,
});
export default router;
