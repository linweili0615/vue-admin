import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    hidden: true,
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index')
    }]
  },

  {
    path: '/test',
    component: Layout,
    redirect: '/test/api/list',
    name: 'API管理',
    meta: { title: 'API管理', icon: 'example' },
    children: [
      {
        path: 'api/list',
        name: 'API列表',
        component: () => import('@/views/test/Projectlist'),
        meta: { title: 'API列表', icon: 'form' }
      },{
        path: 'api/add',
        name: '新增API接口',
        component: () => import('@/views/test/interface/index'),
        meta: { title: '新增API接口', icon: 'form' }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
