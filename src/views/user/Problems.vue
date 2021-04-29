<template>
    <div class="problems" id="problems">
        <div class="container user-container">
            <questionlist :buttons="buttons" @queryQuestion="queryQuestion" />
        </div>
    </div>
</template>

<script>
import questionlist from '@/views/components/Questionlist.vue'
export default {
    components: {
        questionlist,
    },
    data() {
        return {
            buttons: [
                {
                    text: "查看",
                    method: "queryQuestion"
                }
            ],
        }
    },
    methods: {
        // 打开题目页面，传入题目ID
        queryQuestion(param) {
            // 修改路由到question
            console.log(param);
            this.$router.push('/problems/' + param.ID);
        },
    }
}
</script>

<style>
    .problems {
        padding-top: 10px;
    }
</style>