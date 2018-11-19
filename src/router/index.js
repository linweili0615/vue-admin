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
    redirect: '/test/project/list',
    name: 'API管理',
    meta: { title: 'API管理', icon: 'example' },
    children: [
      {
        path: 'project/list',
        name: '项目列表',
        component: () => import('@/views/test/ProjectList'),
        meta: { title: '项目列表', icon: 'form' }
      },{
        path: 'api/add',
        name: 'API接口',
        component: () => import('@/views/test/Api'),
        meta: { title: 'API接口', icon: 'form' }
      }
    ]
  },
  {
    path: '/project/project=:id',
    component: Layout,
    name: '测试集',
    hidden: true,
    children: {
      path: '/case/project=:id',
      component: () => import('@/views/test/ApiCase'),
      name: '测试集',
      leaf: true,
      child: true,
      children: [
        {   path: '/apiList/project=:id', component: () => import('@/views/test/ApiCaseList'), name: '接口列表'},
        /*{   path: '/apiList/project=:id/first=:firstGroup', component: ApiListGroup, name: '分组接口列表'},
        {   path: '/fastTest/project=:id', component: FestTest, name: '快速测试'},
        {   path: '/addApi/project=:id', component: addApi, name: '新增接口'},
        {   path: '/detail/project=:id/api=:api_id',
          component: detail,
          name: '接口',
          children: [
            { path: '/apiInfo/project=:project_id/api=:api_id', component: ApiInfo, name: '基础信息'},
            { path: '/testApi/project=:project_id/api=:api_id', component: testApi, name: '测试'},
            { path: '/apiDynamic/project=:project_id/api=:api_id', component: ApiDynamic, name: '历史'},
          ]
        },
        { path: '/updateApi/project=:project_id/api=:api_id', component: UpdateApi, name: '修改'},*/
      ]},
  },
  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
