<template>
    <div class="home" id="home">
        <questionlist :buttons="buttons" @goQuestion="goQuestion" />
    </div>
</template>

<script>
import questionlist from '../components/questionlist.vue'
export default {
    components: {
        questionlist,
    },
    data() {
        return {
            buttons: [
                {
                    text: "查看",
                    method: "goQuestion"
                }
            ],
        }
    },
    methods: {
        // 打开题目页面，传入题目ID
        goQuestion(param) {
            // 修改路由到question
            console.log(param);
            this.$router.push('/question/' + param.ID);
        },
    }
}
</script>

<style>
    .home * {
        font-size: 15px;
        letter-spacing: 1px;
    }
    .home .ant-table-title {
        padding: 10px 20px;
    }
    .highlight {
        background-color: rgb(255, 192, 105);
        padding: 0px;
    }
</style>