import Vue from 'vue';
import Router from 'vue-router';
import modules from '@/modules';

Vue.use(Router);

const routes = [
  {
    path: '/',
    redirect: '/statistic-dash',
  },
];
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

export default new Router({
  routes,
});
