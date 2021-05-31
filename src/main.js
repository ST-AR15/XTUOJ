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
Vue.prototype.$language = {
    name: [],
    num: [],
};
Vue.prototype.$cmModeText= {
    GCC: 'text/x-csrc',
    'G++': 'text/x-c++src',
    python3: 'text/x-python',
    java:'text/x-java'
},
Vue.prototype.$balloonColor = [
    {
        text: "红色",
        color: "#FF0000",
        font: "#FFFFFF",
    },
    {
        text: "绿色",
        color: "#00FF00",
        font: "#000000",
    },
    {
        text: "蓝色",
        color: "#0000FF",
        font: "#FFFFFF",
    },
    {
        text: "黑色",
        color: "#000000",
        font: "#FFFFFF",
    },
    {
        text: "灰色",
        color: "#999999",
        font: "#000000",
    },
    {
        text: "白色",
        color: "#FFFFFF",
        font: "#000000",
    },
    {
        text: "黄色",
        color: "#FFFF00",
        font: "#000000",
    },
    {
        text: "紫色",
        color: "#FF00FF",
        font: "#FFFFFF",
    },
    {
        text: "青色",
        color: "#00FFFF",
        font: "#000000",
    },
    {
        text: "粉色",
        color: "#FF80FF",
        font: "#000000",
    },
    {
        text: "橘黄色",
        color: "#F0530E",
        font: "#FFFFFF",
    },
    {
        text: "深绿色",
        color: "#00AA00",
        font: "#FFFFFF",
    },
    {
        text: "深紫色",
        color: "#703BA7",
        font: "#FFFFFF",
    },
    {
        text: "墨绿色",
        color: "#1F5851",
        font: "#FFFFFF",
    },
    {
        text: "杏色",
        color: "#DFB39A",
        font: "#000000",
    },
    {
        text: "棕色",
        color: "#C48252",
        font: "#000000",
    }
]
Vue.prototype.$judge = ["AcmMode", "OiMode", "HalfOiMode"];
// result数字的含义,负数用了下划线
Vue.prototype.$resultText = {
    "-2": "Judging",
    "-1": "ACCEPT",
    0: "WAITING",
    1: "WRONG_ANSWER",
    2: "TIME_LIMIT_EXCEEDED",
    3: "MEMORY_LIMIT_EXCEEDED",
    4: "RUNTIME_ERROR",
    5: "SYSTEM_ERROR",
    6: "COMPILE_ERROR",
    7: "RUNNED",
    8: "OUTPUT_LIMIT_EXCEEDED",
    9: "PRESENTATION_ERROR",
    10:"Test_ERROR",
};
Vue.prototype.$mavonExternalLink = {
    markdown_css: function() {
        // 这是你的markdown css文件路径
        return '/source/markdown/github-markdown.min.css';
    },
    hljs_js: function() {
        // 这是你的hljs文件路径
        return '/source/highlightjs/highlight.min.js';
    },
    hljs_css: function(css) {
        // 这是你的代码高亮配色文件路径
        return '/source/highlightjs/styles/' + css + '.min.css';
    },
    hljs_lang: function(lang) {
        // 这是你的代码高亮语言解析路径
        return '/source/highlightjs/languages/' + lang + '.min.js';
    },
    katex_css: function() {
        // 这是你的katex配色方案路径路径
        return '/source/katex/katex.min.css';
    },
    katex_js: function() {
        // 这是你的katex.js路径
        return '/source/katex/katex.min.js';
    },
}
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
