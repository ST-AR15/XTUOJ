// TODO 题目的上传还没全
<template>
    <div class="admin-question-add" id="admin-question-add">
        <h2 class="admin-title">新增题目</h2>
        <a-upload
            name="file"
            :multiple="true"
            :action= questionFile.url
            :header= questionFile.header
            accept=".zip"
            @change="handleQuestionFile"
        >
            <a-button> <a-icon type="upload" /> 点击上传文件 </a-button>
        </a-upload>
        <p>已上传的题目ID:{{ questionFile.result }}</p>
    </div>
</template>

<script>
export default {
    data() {
        return {
            questionFile: {
                url: "",
                header: {},
                result: [],
            }
        }
    },
    methods: {
        handleQuestionFile(info) {  
            // 先清空
            this.questionFile.result = [];
            for(let i in info.fileList) {
                this.questionFile.result = this.questionFile.result.concat(info.fileList[i].response.data);
            }
        },
    },
    mounted:function() {
        // 设置有关题目上传的信息
        this.questionFile.url = this.$axios.defaults.baseURL + '/api/upload/problem',
        this.questionFile.header = {
            Authorization: "Bearer" + this.$store.state.token,
        }
    }
}
</script>

<style>
</style>
