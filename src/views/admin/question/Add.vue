// TODO 题目的上传还没全
<template>
    <div class="admin-question-add" id="admin-question-add">
        <h2 class="admin-title">新增题目</h2>
        <questionform ref="questionForm" okText="创建" @querySubmit="queryForm" />
        <a-modal
            title="添加成功!"
            :visible="modal.visible"
            :footer="null"
            @cancel="modal.visible = false"
        >
            <p>请选择操作：</p>
            <a-space>    
                <a-button @click="handleReset(); modal.visible = false" type="primary">继续添加</a-button>
                <a-button type="primary">跳转到该题目</a-button>
            </a-space>
        </a-modal>
    </div>
</template>

<script>
import questionform from '@/views/components/QuestionForm.vue'
export default {
    components: {
        questionform
    },
    data() {
        return {
            modal: {
                visible: false,
            }
        }
    },
    methods: {
        queryForm(form) {     //提交表单
            const info = {    // 传给后端的info
                Tittle: form.name,
                Source: form.source,
                Content: form.contents,
                TimeLimit: form.timeLimit,
                MemoryLimit: form.memoryLimit,
                IsBan: String(form.isBan),
                Solved: form.isSolved? "yes": "no",
                // TODO: 没有判题输入和判题输出
            };
            // url
            const url = "/api/problem";
            this.$axios.post(url, info).then(rep => {
                console.log(rep);
                // 弹出对话框
                this.modal.visible = true;
            })
        },
        handleReset() {
            this.$refs.questionForm.handleReset();
        }
        
    },
}
</script>

<style>
</style>
