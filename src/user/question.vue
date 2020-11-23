<template>
    <div class="question" id="question">
        <a-page-header 
            title="返回"
            @back="back"
        />
        <!-- 题目ID和 -->
        <p>
            <span>ID</span>
            {{ ID }}:{{ title }}
        </p>
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
        <p v-text="questionDetail">
        
        </p>
        <!-- 样例输入和样例输出 -->
        <p>
            <span>样例输入</span>
        </p>
        <p>
            <span>样例输出</span>
        </p>
    </div>
</template>

<script>
export default {
    props: ['ID','page'],  // 从父组件获得题目ID，然后在接口里获得全部值
                           // 还要获取来的时候的页面
    data() {
        return {
            title: "1",
            tips: ["dp","geometry","math","greedy"],
            questionDetail: "123"
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

</style>