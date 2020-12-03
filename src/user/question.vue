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
                        <span>ID</span>
                        {{ ID }}:{{ title }}
                    </h1>
                    <!-- 题目标签 -->
                    <p>
                        <a-tag
                            v-for="tip in tips"
                            :key="tip"
                            v-bind:id="'tip-' + tip"
                        >
                            {{tip}}
                        </a-tag>
                    </p>
                    <!-- 题目内容 -->
                    <h2>题目详情</h2>
                    <p v-text="questionDetail"></p>
                    <!-- 样例输入 -->
                    <h2>样例输入</h2>
                    <p v-text="sampleInput"></p>
                    <!-- 样例输出 -->
                    <h2>样例输出</h2>
                    <p v-text="sampleOutput"></p>
                    
                </a-layout-sider>
                <a-layout-content>
                    <div>
                        <p>
                            语言：
                            <a-select v-model="language" style="width: 120px" defult-value="c">
                                <template v-for="item in language_used">
                                    <a-select-option :key="item" :value="item">
                                        {{ item }}
                                    </a-select-option>
                                </template>
                            </a-select>
                        </p>
                    </div>
                    <!-- <a-textarea style="height:720px; resize: none" placeholder="Coding here……"></a-textarea> -->
                    <mavon-editor style="height:700px;margin-bottom:20px" :subfield="false" :toolbarsFlag="false" placeholder="Code here……" :tabSize="4" v-model="code"></mavon-editor>
                    <!-- <codemirror
                        ref="code"
                        :value="code"
                        :options="codemirrorOptions"
                        class="code">
                    </codemirror> -->
                    <div>
                        <a-button type="primary">提交</a-button>
                    </div>
                </a-layout-content>
                
            </a-layout>
        </a-layout>
    </div>
</template>

<script>
import {mavonEditor} from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
// import { codemirror } from 'vue-codemirror'
// import "codemirror/theme/ambiance.css";  
// require("codemirror/mode/javascript/javascript"); 
export default {
    components: {
        mavonEditor
        // codemirror
    },
    props: ['ID','page'],  // 从父组件获得题目ID，然后在接口里获得全部值
                           // 还要获取来的时候的页面
    data() {
        
        return {
            language: "C",
            language_used: ["C","C++","Java","JavaScript","PHP","Ruby"],
            title: "小蜗牛爬楼",
            tips: ["dp","geometry","math","greedy"],
            questionDetail: "小蜗牛爬楼，假设白天能爬x米，晚上会下落y米（x>y），楼总高z米。小蜗牛要多少天才能爬上去？",
            sampleInput: "5 1 10",
            sampleOutput: "3",
            code: "",  //当前输入的代码
        }
    },
    methods: {
        back() {  //返回上一页的方法
            this.$emit('goPage', this.page);
        }
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