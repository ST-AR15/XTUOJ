// 声明通过npm安装的组件等
import Vue from 'vue'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import VueCodeMirror from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
// import mavonEditor from 'mavon-editor'
// import 'mavon-editor/dist/css/index.css'
// import VueCodeMirror from 'vue-codemirror'
// import 'codemirror/lib/codemirror.css'
// Vue.use(Antd,VueCodeMirror)

// const baseUrl = "http://172.22.114.116/api/problem"  // 校园网环境
const baseUrl = "http://47.106.68.121:8887"          // 公网url

Vue.use(Antd,VueCodeMirror)
Vue.prototype.$axios = axios
Vue.prototype.$baseUrl = baseUrl

/**
 * axios使用：
 * this.$axios.get(url,param).then(rep => {
 *     console.log(rep);
 * })
 * 如果是用post就把get换成post
 */

// 声明自己写的文件
import '@/components/antd.css'
import '@/components/tips.css'
import '@/components/animation.css'
import '@/components/mavonEditor.css'
import '@/components/axiosConfig'


Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
