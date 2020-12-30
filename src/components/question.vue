<template>
    <div class="question" id="question">
        <a-layout>
            <a-layout-header style="padding: 0">
                <a-page-header 
                    title="返回"
                    @back="back"
                />
            </a-layout-header>
            <a-layout>
                <a-layout-sider>
                    <!-- 题目ID和title -->
                    <h1>
                        ID {{ ID }}:{{ question.title }}
                    </h1>
                    <!-- 题目标签 -->
                    <p>
                        <a-tag
                            v-for="tip in question.tips"
                            :key="tip"
                            v-bind:id="'tip-' + tip"
                        >
                            {{tip}}
                        </a-tag>
                    </p>
                    <p>
                        时间限制：<span v-text="question.timeLimit"></span>ms
                        内存限制：<span v-text="question.memoryLimit"></span>MB
                    </p>
                    <!-- 题目内容 -->
                    <!-- <h2>题目详情</h2> -->
                    <mavon-editor v-model="question.questionDetail" :subfield="false" :toolbarsFlag="false" defaultOpen="preview"></mavon-editor>
                </a-layout-sider>
                <a-layout-content style="padding:10px;">
                    <div>
                        <p>
                            语言：
                            <a-select v-model="question.language" style="width: 120px" defult-value="c">
                                <template v-for="item in question.language_allowed">
                                    <a-select-option :key="item" :value="item">
                                        {{ item }}
                                    </a-select-option>
                                </template>
                            </a-select>
                        </p>
                    </div>
                    <!-- <mavon-editor style="height:700px;margin-bottom:20px;z-index:1" :subfield="false" :toolbarsFlag="false" placeholder="Code here……" :tabSize="4" v-model="question.code"></mavon-editor> -->
                    <codemirror
                        ref="mycode"
                        :value="question.code"
                        :options="cmOptions"
                        >
                    </codemirror>
                    <div style="margin-top:50px">
                        <a-button type="primary">提交</a-button>
                    </div>
                </a-layout-content>
                
            </a-layout>
        </a-layout>
    </div>
</template>

<script>
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import { codemirror } from 'vue-codemirror'
import 'codemirror/theme/ambiance.css'
require('codemirror/mode/javascript/javascript')
require('codemirror/mode/clike/clike')
export default {
    components: {
        mavonEditor,
        codemirror
    },
    props: {
        ID: Number,
        backMethod: String,
    },  // 从父组件获得题目ID，然后在接口里获得全部值
    data() {
        
        return {
            cmOptions:{
                value:'',
                mode:"text/javascript",
                indentUnit: 4,
                readOnly:false,
                lineNumbers: true,
                matchBrackets: true,
            },
            question: {
                language: "C",
                timeLimit: 128,
                memoryLimit: 128,
                language_allowed: ["C","C++","Java","JavaScript","PHP","Ruby"],
                title: "小蜗牛爬楼",
                tips: ["dp","geometry","math","greedy"],
                questionDetail: "小蜗牛爬楼，假设白天能爬x米，晚上会下落y米（x>y），楼总高z米。小蜗牛要多少天才能爬上去？",
                code: "",  //当前输入的代码
            }
            
        }
    },
    methods: {
        back() {  //返回上一页的方法
            this.$emit("back");
        }
    },
    mounted: function() {
        console.log("打开了题目" + this.ID);
        let url = 'http://172.22.114.116/api/problem/' + this.ID;
        this.$axios.get(url).then(rep => {
            const data = rep.data.data;
            // Pid
            this.question.title = data.Tittle;
            // source
            this.question.questionDetail = data.Content;
            this.question.timeLimit = data.TimeLimit;
            this.question.memoryLimit = data.MemoryLimit;
            // IsBan
            // Accept
            // Submit
            // Solved
            // created_at
            // update_at
        })
    }
}
</script>

<style>
.question {
    width: 1000px;
    background-color: #FAFAFA;
    position: relative;
    margin: 0 auto;
}
.question .ant-layout-sider {
    max-width: 400px !important;
    min-width: 400px !important;
    width: 400px !important;
    min-height: 800px;
    max-height: 800px;
    height: 800px;
    overflow-y: scroll;
    padding: 5px;
}
.question h1 {
    font-size: 26px;
    border-left: 8px solid #1890FF;
    padding-left: 4px;
}
.question h2 {
    font-size: 26px;
    margin-top: 45px;
    border-left: 8px solid #1890FF;
    padding-left: 4px;
    user-select: none;
}
.question p {
    font-size: 20px;
}
</style>