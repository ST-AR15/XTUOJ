<template>
    <div class="home" id="home">
        <questionlist v-show="displayNow == 'questionlist'" :buttons="buttons" @goQuestion="goQuestion" />
        <question v-show="displayNow == 'question'" :ID="questionID" @back="goQuestionlist" />
    </div>
</template>

<script>
import question from '../components/question.vue';
import questionlist from '../components/questionlist.vue'
export default {
    components: {
        questionlist,
        question,
    },
    data() {
        return {
            displayNow: "questionlist",
            questionID: 1000,
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
        goQuestion(ID) {
            // console.log("打开题目" + ID);
            // this.$emit('goQuestion', ID,"home");
            this.questionID = ID;
            this.displayNow = "question";
        },
        // 回到题目列表
        goQuestionlist() {
            this.displayNow = "questionlist"
        }
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