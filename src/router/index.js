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
    path: '/api',
    component: Layout,
    redirect: '/list',
    name: 'API管理',
    meta: { title: 'API管理', icon: 'example' },
    children: [
      {
        path: '/list',
        name: '项目列表',
        component: () => import('@/views/test/ProjectList'),
        meta: { title: '项目列表', icon: 'form' }
      },{
        path: '/add',
        name: 'API接口',
        component: () => import('@/views/test/Api'),
        meta: { title: 'API接口', icon: 'form' }
      },{
        path: '/project/:id',
        hidden: true,
        component: () => import('@/views/test/ApiCase'),
        name: '测试分组',
        meta: { title: '测试分组', icon: 'example' }
      },{
        path: '/taskcase',
        component: () => import('@/views/test/TaskCase'),
        name: '定时任务',
        meta: { title: '定时任务', icon: 'example' }
      }

    ]
  },
  /*{
    path: '/project/:id',
    component: Layout,
    redirect: '/project/:id/list',
    name: '测试集',
    meta: { title: '测试集', icon: 'example' },
    hidden: true,
    children: [
      {
        path: '/project/:id/list',
        component: () => import('@/views/test/ApiCase'),
        name: '测试分组',
        meta: { title: '测试分组', icon: 'example' },
      }
    ],
  },*/
  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
