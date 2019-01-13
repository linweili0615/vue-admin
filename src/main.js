import Vue from 'vue'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss' // global css
import App from './App'
import router from './router'
import store from './store'
import service from '@/utils/request'
import VueClipboard from 'vue-clipboard2'

import '@/icons' // icon
import '@/permission' // permission control


Vue.use(ElementUI)
Vue.use(VueClipboard)

import { Message } from 'element-ui'
import { Notification } from 'element-ui';

Vue.prototype.$message = Message
Vue.prototype.$notify = Notification
Vue.prototype.$axios = service

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
