// 声明通过npm安装的组件等
import Vue from 'vue'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import App from './App.vue'
import router from './router'
import VueEditor from 'vue-md-editor'
Vue.use(Antd, VueEditor)
// Vue.ues(VueEditor)

// 声明自己写的文件
import '@/components/antd.css'
import '@/components/tips.css'


Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
