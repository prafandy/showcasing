import Vue from 'vue';
import VueRouter from 'vue-router';

import auth from '@/utils/auth';
import i18next from './utils/i18next';
import url from '@/utils/url';

import App from './App.vue';
import LayoutBlank from './layouts-vue/LayoutBlank';
import LayoutDefault from './layouts-vue/LayoutDefault';
import Index from '@/pages-vue/Index.vue';
import ErrorPage from '@/pages-vue/ErrorPage.vue';
import Login from /* webpackChunkName: 'auth' */ '@/pages-vue/auth/Login.vue';
import UserList from /* webpackChunkName: 'user' */ '@/pages-vue/user/UserList.vue';
import UserDatatables from /* webpackChunkName: 'user' */ '@/pages-vue/user/UserDatatables.vue';
import UserForm from /* webpackChunkName: 'user' */ '@/pages-vue/user/UserForm.vue';

import BintanElla from '@/pages-vue/BintanElla.vue';

Vue.config.productionTip = false
Vue.use(VueRouter)
Vue.prototype.$t = i18next.t;
Vue.prototype.$url = url;

// function dynamicPropsFn (route) {
//   return {
//     msg: `${route.params.any} (${route.params.any.length} chars)`
//   };
// }
const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  // base: '/showcasing',
  scrollBehavior: (to, from, savedPosition) => savedPosition || { x: 0, y: 0 },
  routes: [
    {
      path: '/:lang',
      component: App,
      children: [
        {
          path: '',
          component: LayoutDefault,
          children: [
            {
              name: 'index',
              path: '',
              component: Index,
            },
          ],
        },
        {
          path: '',
          component: LayoutBlank,
          children: [
            {
              name: 'login',
              path: 'login',
              component: Login,
              meta: { requireAuth: false },
            },
            {
              path: 'bintan-ella',
              component: BintanElla,
            },
            {
              name: '404',
              path: '404',
              component: ErrorPage,
              meta: {
                title: "404",
                description: "The page you are trying to access doesn't exist.",
              },
            },
          ],
        },
        {
          name: 'user',
          path: 'user',
          component: LayoutDefault,
          meta: { requireAuth: true },
          children: [
            {
              name: 'user-index',
              path: '',
              component: UserList,
            },
            {
              name: 'user-datatables',
              path: 'datatables',
              component: UserDatatables,
            },
            {
              name: 'user-create',
              path: 'create',
              component: UserForm,
            },
            {
              name: 'user-update',
              path: 'update/:id',
              component: UserForm,
              props: true,
            },
            // { path: '/:msg', component: Documentation, props: true },
            // { path: '/:any', components: {default: Documentation, footer: Document}, props: dynamicPropsFn,
            //   meta: { layout: () => import(/* webpackChunkName: 'layout' */ '@/layouts-vue/LayoutBlank.vue') },
            // },
          ],
        },
        {
          path: ':any',
          component: ErrorPage,
          meta: {
            title: "404",
            description: "The page you are trying to access doesn't exist.",
          },
        },
      ],
    },
    {
      path: '',
      beforeEnter: (to, from, next) => {
        next(url(''));
      },
    },
  ]
})

router.beforeEach(async (to, from, next) => {
  if (!to.params.lang) {
    next();
    return;
  }

  if (i18next.options.supportedLngs.includes(to.params.lang)) {
    let requireAuth = null;
    to.matched.forEach(route => {
      if ('requireAuth' in route.meta) {
        requireAuth = route.meta.requireAuth;
      }
    });
    if (requireAuth === null) next();
    else {
      if (requireAuth && auth.isLoggedIn()) {
        next();
      } else if (requireAuth && !auth.isLoggedIn()) {
        next(url('/login'));
      } else if (!requireAuth && auth.isLoggedIn()) {
        next(from.fullPath); // doesn't work correctly yet
      } else if (!requireAuth && !auth.isLoggedIn()) {
        next();
      }
    }
  } else {
    next(url('/404'));
  }
});

new Vue({
  // el: '#app',
  router: router,
  render: h => h(App),
}).$mount('#app')
