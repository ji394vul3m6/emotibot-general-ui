import Vue from 'vue';
import Router from 'vue-router';
import modules from '@/modules';

Vue.use(Router);

const routes = [];
Object.keys(modules).forEach((moduleName) => {
  const pageModule = modules[moduleName];
  Object.keys(pageModule.pages).forEach((pageName) => {
    routes.push({
      path: `/${pageModule.pages[pageName].path}`,
      name: pageModule.pages[pageName].name,
      component: pageModule.pages[pageName],
    });
  });
});

export default new Router({
  routes,
});
