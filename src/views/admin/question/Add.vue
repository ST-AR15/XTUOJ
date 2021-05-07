// TODO 题目的上传还没全
<template>
    <div class="admin-question-add" id="admin-question-add">
        <h2 class="admin-title">新增题目</h2>
        <a-form-model
            ref="addForm"
            :model="form"
            :label-col="{ span: 3 }"
            :wrapper-col="{ span: 14 }"
            :rules="rules"
        >
            <a-form-model-item prop="name" label="题目名称">
                <a-input
                    style="width: 210px"
                    v-model="form.name"
                    placeholder="题目名称"
                ></a-input>
            </a-form-model-item>

            <a-form-model-item label="题目来源">
                <a-input
                    style="width: 210px"
                    v-model="form.source"
                    placeholder="题目来源"
                ></a-input>
            </a-form-model-item>

            <a-form-model-item prop="timeLimit" label="时限">
                    <a-input
                        style="width: 210px"
                        placeholder="请输入500的倍数" 
                        :min="0"
                        v-model="form.timeLimit"
                        :step="500"
                        suffix="ms"
                    ></a-input>
            </a-form-model-item>

            <a-form-model-item prop="memoryLimit" label="存限">
                <a-input
                    style="width: 210px"
                    :min="0"
                    v-model="form.memoryLimit"
                    suffix="MB"
                ></a-input>
            </a-form-model-item>

            <a-form-model-item label="题目类型">
                <a-radio-group 
                    v-model="form.QType"
                >
                    <a-radio value="normal">普通验证</a-radio>
                    <a-radio value="special">特别验证</a-radio>
                </a-radio-group>
                <transition name="cross2">
                    <a-button type="primary" v-if="form.QType == 'special'">上传特判文件</a-button>
                </transition>
            </a-form-model-item>

            <a-form-model-item label="题目内容" :wrapper-col="{ span: 21, offset: 0 }">
                <mavon-editor :tabSize="3" :toolbars="editorOption" v-model="form.contents"></mavon-editor>
            </a-form-model-item>

            <a-form-model-item label="是否禁用">
                <a-switch checked-children="是" un-checked-children="否" @change="form.isBan = !form.isBan" />
            </a-form-model-item>

            <a-form-model-item label="是否解决">
                <a-switch checked-children="是" un-checked-children="否" @change="form.isSolved = !form.isSolved" />
            </a-form-model-item>
            
            <a-divider />

            <a-form-model-item :wrapper-col="{ span: 14, offset: 2 }">
                <a-button @click="queryForm" type="primary">上传</a-button>
                <a-button @click="handleReset" style="margin-left:10px;">重置</a-button>
            </a-form-model-item>
        </a-form-model>
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
// import editor from '@/components/editor.vue'
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
export default {
    components: {
        mavonEditor
    },
    data() {
        return {
            editorOption: {          // 富文本输入框的设置
                bold: true,          // 粗体
                italic: true,        // 斜体
                header: true,        // 标题
                underline: true,     // 下划线
                strikethrough: true, // 中划线
                mark: false,         // 标记
                superscript: false,  // 上角标
                subscript: false,    // 下角标
                quote: true,         // 引用
                ol: true,            // 有序列表
                ul: true,            // 无序列表
                link: true,          // 链接
                imagelink: true,     // 图片链接
                code: true,          // code
                table: true,         // 表格
                fullscreen: true,    // 全屏编辑
                readmodel: true,     // 沉浸式阅读
                htmlcode: true,      // 展示html源码
                help: true,          // 帮助
                undo: true,          // 上一步
                redo: true,          // 下一步
                trash: true,         // 清空
                save: false,         // 保存（触发events中的save事件）
                navigation: true,    // 导航目录
                alignleft: true,     // 左对齐
                aligncenter: true,   // 居中
                alignright: true,    // 右对齐
                subfield: true,      // 单双栏模式
                preview: true,       // 预览
            },
            formDefault: {                // 默认的表单数据
                name: "",                // 题目名称
                timeLimit: 1000,         // 时限，默认1000ms
                memoryLimit: 128,        // 存限，默认128MB
                QType: "normal",         // 题目类型，分普通验证（normal）和特别验证（special），默认普通
                contents: "",            // 题目内容
                source: "",              // 题目来源
                isBan: false,            // 禁用
                isSolved: false,         // 解决
            },
            form: {                      // 表单数据
                name: "",                // 题目名称
                timeLimit: 0,            // 时限，默认1000ms
                memoryLimit: 0,          // 存限，默认128MB
                QType: "",               // 题目类型，分普通验证（normal）和特别验证（special），默认普通
                contents: "",            // 题目内容
                source: "",              // 题目来源
                isBan: false,            // 禁用
                isSolved: false,         // 解决
            },
            rules: {                     // 表单规则
                name: [                  // 题目名称规则：必须输入内容，否则提示“请输入题目名称”
                    { required: true, message: '请输入题目名称', trigger: 'change' },
                ],
                timeLimit: [             // 时限规则：必须是500的倍数，否则向上取整
                    { required: true, message: '请输入时限!', trigger: 'change' },
                    { validator: ((rule, value, callback) => {
                        if(value % 500 !== 0 || value < 0) {
                            callback(new Error('请输入500的正整数倍数'))
                        } else {
                            callback();
                        }
                    }), trigger: 'change' },
                    // { pattern: new RegExp(/^[1-9]\d*[05]00$|500/, "g"), message: '请输入500的正倍数', trigger: 'change' },
                ],
                memoryLimit: [          // 存限规则：必须存在
                    { required: true, message: '请输入存限', trigger: 'change' },
                ]
            },
            modal: {
                visible: false,
            }
        }
    },
    methods: {
        queryForm() {     //提交表单
            let that = this;
            this.$refs.addForm.validate(valid => {
                if(valid) {
                    let timeLimit;
                    if(that.form.timeLimit%500 != 0) {  // 修改无效的时限
                        timeLimit = (parseInt(that.form.timeLimit/500)+1)*500;
                        this.$message.info(`已将时限的${ that.form.timeLimit }修改为${ timeLimit }`);
                    }
                    const info = {    // 传给后端的info
                        Tittle: that.form.name,
                        source: that.form.source,
                        Content: that.form.contents,
                        TimeLimit: that.form.timeLimit,
                        MemoryLimit: that.form.memoryLimit,
                        IsBan: String(that.form.isBan),
                        // TODO 和删除题目一样，其实不知道这个isSolved有啥用
                        Solved: that.form.isSolved? "yes": "no",
                        // TODO: 没有判题输入和判题输出
                    };
                    // url
                    const url = "/api/problem";
                    that.$axios.post(url, info).then(rep => {
                        console.log(rep);
                        // 弹出对话框
                        that.modal.visible = true;
                    })
                } else {
                    this.$message.warn('请保证题目信息有效！');
                    return false;
                }
            })
        },
        handleReset() {  //清空表单
            // this.$refs.addForm.resetFields();
            // this.form = this.formDefault;
            this.form = JSON.parse(JSON.stringify(this.formDefault));
            console.log(this.formDefault);
        },
    },
    mounted:function() {
        // 让form的值变为默认值
        this.form = JSON.parse(JSON.stringify(this.formDefault));
    }
}
</script>

<style>
</style>
