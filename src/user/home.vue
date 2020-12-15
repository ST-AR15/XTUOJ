<template>
    <div class="home" id="home">
        <questionlist :buttons="buttons" />
    </div>
</template>

<script>
import questionlist from '../components/questionlist.vue'
export default {
  components: { questionlist },
    data() {
        return {
            buttons: [
                {
                    text: "查看",
                }
            ]
        }
    },
    methods: {
        // 打开题目页面，传入题目ID
        goQuestion(ID) {
            console.log("打开题目" + ID);
            this.$emit('goQuestion', ID,"home");
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