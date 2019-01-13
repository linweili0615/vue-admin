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
    redirect: '/api/list',
    name: 'API管理',
    meta: { title: 'API管理', icon: 'example' },
    children: [
      {
        path: '/api/list',
        name: '项目列表',
        component: () => import('@/views/test/ProjectList'),
        meta: { title: '项目列表', icon: 'form' }
      },
      {
        path: '/api/add',
        name: 'API接口',
        component: () => import('@/views/test/ApiNew'),
        meta: { title: 'API接口', icon: 'form' }
      },{
        path: '/api/edit',
        name: '修改API接口',
        hidden: true,
        component: () => import('@/views/test/ApiNew'),
        meta: { title: '修改API接口', icon: 'form' }
      },{
        path: '/api/project',
        hidden: true,
        component: () => import('@/views/test/ApiCase'),
        name: '测试分组',
        meta: { title: '测试分组', icon: 'example' }
      },{
        path: '/api/taskcase',
        component: () => import('@/views/test/TaskCase'),
        name: '任务列表',
        meta: { title: '任务列表', icon: 'example' }
      },{
        path: '/api/task/result',
        component: () => import('@/views/test/TaskResult'),
        name: '结果页',
        hidden: true,
        meta: { title: '结果页', icon: 'example' }
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
