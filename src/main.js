// 声明通过npm安装的组件等
import Vue from 'vue'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import App from './App.vue'
import router from '@/router'
import axios from 'axios'
import VueCodeMirror from 'vue-codemirror'
import store from './store'
import 'codemirror/lib/codemirror.css'


Vue.use(Antd, VueCodeMirror)
Vue.prototype.$axios = axios
// 允许使用的编译器
Vue.prototype.$language = ["GCC", "C++", "Python"];

// 声明自己写的文件
// 样式
import '@/styles/antd.css'
import '@/styles/tips.css'
import '@/styles/animation.css'
import '@/styles/mavonEditor.css'
import '@/styles/globle.css'
// js
import '@/utils/axiosConfig'


Vue.config.productionTip = false



new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
