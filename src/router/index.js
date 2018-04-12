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

const router = new Router({
  routes,
});

// TODO: check privilege here, if has no privilege, go "/"
router.beforeEach((to, from, next) => {
  // If match no module, go root
  if (to.matched.length === 0) {
    window.location = '/';
  }
  next();
});
export default router;
