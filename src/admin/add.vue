<template>
    <div class="add" id="add">
        <h2 
            style="border-left:10px solid #1890FF; padding-left:5px"
        >新增题目</h2>
        <a-form-model
            ref="addForm"
            :model="form"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
            :rules="rules"
        >
            <a-form-model-item label="题目名称">
                <a-input 
                    v-model="form.name"
                    class="inline-element"
                    placeholder="题目名称"
                ></a-input>
            </a-form-model-item>

            <a-form-model-item label="时限">
                    <a-input
                        placeholder="请输入500的倍数" 
                        class="inline-element"
                        :min="0"
                        v-model="form.timeLimit"
                        type="number"
                        :step="500"
                        suffix="ms"
                    ></a-input>
                    <!-- todo 添加动画 -->
                    <p v-show="form.timeLimit%500 != 0" style="line-height:12px; height:12px; position:absolute; margin: 0; white-space:nowrap">
                        <span>
                            我们会把这个数字取整到{{(parseInt(form.timeLimit/500)+1)*500}}，因为这个数必须是500的倍数
                        </span>
                    </p>
            </a-form-model-item>

            <a-form-model-item label="存限">
                <a-input
                    class="inline-element"
                    :min="0"
                    v-model="form.storageLimit"
                    type="number"
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
            </a-form-model-item>

            <a-form-model-item label="题目内容">
                <mavon-editor :tabSize="3" :toolbars="editorOption" v-model="form.contents"></mavon-editor>
            </a-form-model-item>

            <a-form-model-item label="输入">
                <a-textarea v-model="form.inputTips"></a-textarea>
            </a-form-model-item>

            <a-form-model-item label="输出">
                <a-textarea v-model="form.outputTips"></a-textarea>
            </a-form-model-item>

            <a-form-model-item label="题目数据">
                <div v-bind:key="i" v-for="(data,i) in form.data.input" style="display:flex;width:700px;">
                    <a-textarea v-model="form.data.input[i]"></a-textarea>
                    <div style="white-space: nowrap; margin: 0 20px">
                        输入
                        <a-divider type="vertical" />
                        输出
                    </div>
                    <a-textarea v-model="form.data.output[i]"></a-textarea>
                </div>
                <a-divider />
                <div style="display:flex;align-items:center">
                    <div style="display:flex;width:700px;flex-shrink:0">
                        <a-textarea v-model="dataInputIn"></a-textarea>
                        <div style="white-space: nowrap; margin: 0 20px">
                            输入
                            <a-divider type="vertical" />
                            输出
                        </div>
                        <a-textarea v-model="dataInputOut"></a-textarea>
                    </div>
                    <a-button type="primary" style="margin-left: 20px" @click="addData()">添加</a-button>
                </div>
            </a-form-model-item>
            
            <a-divider />

            <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
                <a-button @click="submitForm" type="primary">上传</a-button>
                <a-button @click="resetForm" style="margin-left:10px;">重置</a-button>
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
                <a-button @click="resetForm(); modal.visible = false" type="primary">继续添加</a-button>
                <a-button type="primary">跳转到该题目</a-button>
            </a-space>
        </a-modal>
    </div>
</template>

<script>
// import editor from '@/components/editor.vue'
import {mavonEditor} from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
export default {
    components: {
        mavonEditor
    },
    data() {
        return {
            editorOption: {              // 富文本输入框的设置
                bold: true, // 粗体
                italic: true, // 斜体
                header: true, // 标题
                underline: true, // 下划线
                strikethrough: true, // 中划线
                mark: false, // 标记
                superscript: false, // 上角标
                subscript: false, // 下角标
                quote: true, // 引用
                ol: true, // 有序列表
                ul: true, // 无序列表
                link: true, // 链接
                imagelink: true, // 图片链接
                code: true, // code
                table: true, // 表格
                fullscreen: true, // 全屏编辑
                readmodel: true, // 沉浸式阅读
                htmlcode: true, // 展示html源码
                help: true, // 帮助
                /* 1.3.5 */
                undo: true, // 上一步
                redo: true, // 下一步
                trash: true, // 清空
                save: false, // 保存（触发events中的save事件）
                /* 1.4.2 */
                navigation: true, // 导航目录
                /* 2.1.8 */
                alignleft: true, // 左对齐
                aligncenter: true, // 居中
                alignright: true, // 右对齐
                /* 2.2.1 */
                subfield: true, // 单双栏模式
                preview: true, // 预览
            },
            dataInputIn: "",             // 题目数据 - 输入的输入框
            dataInputOut: "",            // 题目数据 - 输出的输入框
            labelCol: { span: 4 },
            wrapperCol: { span: 14 },
            formDefult: {                // 默认的表单数据
                name: "",                // 题目名称
                timeLimit: 1000,         // 时限，默认1000ms
                storageLimit: 128,       // 存限，默认128MB
                QType: "normal",         // 题目类型，分普通验证（normal）和特别验证（special），默认普通
                contents: "测试",        // 题目内容
                inputTips: "一个数字",    // 输入格式提示
                outputTips: "一串字符",   // 输出格式提示
                data: {                  // 题目数据
                    input: ["1,2","2,3"],
                    output: ["2","3"],
                }
            },
            form: {                      // 表单数据
                name: "",                // 题目名称
                timeLimit: 0,            // 时限，默认1000ms
                storageLimit: 0,         // 存限，默认128MB
                QType: "",               // 题目类型，分普通验证（normal）和特别验证（special），默认普通
                contents: "",            // 题目内容
                inputTips: "",           // 输入格式提示
                outputTips: "",          // 输出格式提示
                data: {                  // 题目数据
                    input: [],
                    output: [],
                }
            },
            rules: {                     // 表单规则
                name: [                  // 题目名称规则：比如输入内容，否则提示“请输入题目名称”
                    { required: true, message: '请输入题目名称', trigger: 'change' },
                ],
            },
            modal: {
                visible: false,
            }
        }
    },
    methods: {
        submitForm() {     //提交表单
            let that = this;
            this.$refs.addForm.validate(valid => {
                if(valid) {
                    let timeLimit;
                    if(that.form.timeLimit%500 != 0) {  // 修改无效的时限
                        timeLimit = (parseInt(that.form.timeLimit/500)+1)*500;
                        this.$message.info(`已将时限的${that.form.timeLimit}修改为${timeLimit}`);
                    }
                    // 把DetailOut和DetailIn变成字符串
                    // 声明生成字符串的方法
                    let arrayToString = function(arr) {
                        let str = "";
                        for(let i=0;i<arr.length;i++) {
                            str += (arr[i] + "\r\n");
                        }
                        return str;
                    };
                    // 声明这两个变量
                    let detailOut = arrayToString(that.form.data.output);
                    let detailIn = arrayToString(that.form.data.input);
                    let info = {    // 传给后端的info
                        Tittle: that.form.name,
                        // source
                        Content: that.form.contents,
                        TimeLimit: that.form.timeLimit,
                        MemoryLimit: that.form.storageLimit,
                        IsBan: "false", // 写死为false
                        DetailOut: detailOut,
                        DetailIn: detailIn,
                    };
                    // url
                    let url = "http://172.22.114.116/api/problem";
                    that.$axios.post(url,info).then(rep => {
                        console.log(rep);
                        // 弹出对话框
                        that.modal.visible = true;
                    })
                } else {
                    return false;
                }
            })
        },
        resetForm() {  //清空表单
            // this.$refs.addForm.resetFields();
            // this.form = this.formDefult;
            this.form = JSON.parse(JSON.stringify(this.formDefult));
            console.log(this.formDefult);
        },
        addData() { // 添加题目数据
            this.form.data.input.push(this.dataInputIn);
            this.dataInputIn = "";
            this.form.data.output.push(this.dataInputOut);
            this.dataInputOut = "";
            console.log(this.form.data);
        },
        getEditorHTML() {  //获取editor的HTML内容
            // console.log(text);
            // return text;
            window.getEditorMd();
        }
    },
    mounted:function() {
        // 让form的值变为默认值
        this.form = JSON.parse(JSON.stringify(this.formDefult));
    }
}
</script>

<style>
    .add ul {
        list-style: none;
        font-size: 18px;
    }
    .add .flex-between {
        width: 300px;
        display: flex;
        justify-content: space-between;
        margin: 10px;
    }
    .add .inline-element {
        width: 200px;
        display: inline-block;
    }
</style>
