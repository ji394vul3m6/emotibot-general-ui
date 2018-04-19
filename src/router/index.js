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
  Object.keys(pageModule.pages).forEach((pageName) => {
    const page = pageModule.pages[pageName];
    routes.push({
      path: `/${pageModule.pages[pageName].path}`,
      name: `${pageModule.displayNameKey}.${page.displayNameKey}`,
      component: pageModule.pages[pageName],
    });
  });
});

const router = new Router({
  routes,
});
export default router;
