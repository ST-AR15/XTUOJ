// 声明通过npm安装的组件等
import Vue from 'vue'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import App from './App.vue'
import router from '@/router'
import axios from 'axios'
import VueCodeMirror from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'


Vue.use(Antd, VueCodeMirror)
Vue.prototype.$axios = axios

// 声明自己写的文件
// 样式
import '@/styles/antd.css'
import '@/styles/tips.css'
import '@/styles/animation.css'
import '@/styles/mavonEditor.css'
// js，后续可能用vuex
// TODO 使用vuex管理
import '@/views/components/axiosConfig'


Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
