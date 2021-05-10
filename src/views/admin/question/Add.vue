// TODO 题目的上传还没全
<template>
    <div class="admin-question-add" id="admin-question-add">
        <h2 class="admin-title">新增题目</h2>
        <a-tabs default-active-key="one"  @change="handleTab">
            <a-tab-pane key="one">
            <span slot="tab">
                单个题目添加
            </span>
                <questionform ref="questionForm" okText="创建" @querySubmit="queryForm" />
            </a-tab-pane>
            <a-tab-pane key="file">
            <span slot="tab">
                文件批量添加
            </span>
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
            </a-tab-pane>
        </a-tabs>
        
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
            },
            questionFile: {
                url: "",
                header: {},
                result: [],
            }
        }
    },
    methods: {
        handleTab(e) {
            // 初始化题目上传的upload
            if(e == 'file') {
                // 设置有关题目上传的信息
                this.questionFile.url = this.$axios.defaults.baseURL + '/api/upload/problem',
                this.questionFile.header = {
                    Authorization: "Bearer" + this.$store.state.token,
                }
            }
        },
        handleQuestionFile(info) {  
            // 先清空
            this.questionFile.result = [];
            for(let i in info.fileList) {
                this.questionFile.result = this.questionFile.result.concat(info.fileList[i].response.data);
            }
        },
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
