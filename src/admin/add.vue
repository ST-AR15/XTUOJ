<template>
    <div class="add" id="add">
        <h2 
            style="border-left:10px solid #1890FF; padding-left:5px"
        >新增题目</h2>
        <a-form-model
            :model="form"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
            :rules="rules"
        >
            <a-form-model-item label="题目名称" prop="name">
                <a-input 
                    v-model="form.name"
                    class="inline-element"
                ></a-input>
            </a-form-model-item>

            <!-- todo a-input-number有BUG，要不然还是用普通的input -->
            <a-form-model-item label="时限">
                    <a-input-number
                        placeholder="请输入500的倍数" 
                        class="inline-element"
                        :value="form.timeLimit"
                        :min="0"
                        v-model="form.timeLimit"
                        :formatter="value => `${value} ms`"
                        :parser="value => value.replace(' ms', '')"
                        :step="500"
                    ></a-input-number>
                    <!-- todo 通过rules检测来添加这行话 -->
                    <p v-show="form.timeLimit%500 != 0" style="line-height:12px; height:12px; position:absolute; margin: 0; white-space:nowrap">
                        <span>
                            我们会把这个数字取整到{{(parseInt(form.timeLimit/500)+1)*500}}，因为这个数必须是500的倍数
                        </span>
                    </p>
            </a-form-model-item>

            <a-form-model-item label="存限">
                <a-input-number
                    class="inline-element"
                    :value="form.storageLimit"
                    :min="0"
                    v-model="form.storageLimit"
                    :formatter="value => `${value} MB`"
                    :parser="value => value.replace(' MB', '')"
                ></a-input-number>
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
                <a-textarea
                    style="max-width:700px;"
                    :rows="4"
                ></a-textarea>
            </a-form-model-item>

            <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
                <a-button type="primary">上传</a-button>
            </a-form-model-item>
        </a-form-model>
    </div>
</template>

<script>
export default {
    data() {
        return {
            labelCol: { span: 4 },
            wrapperCol: { span: 14 },
            form: {                      // 表单数据
                name: "",                // 题目名称
                timeLimit: 1000,         // 时限，默认1000ms
                storageLimit: 128,       // 存限，默认128MB
                QType: "normal",         // 题目类型，分普通验证（normal）和特别验证（special），默认普通
            },
            rules: {                     // 表单规则
                name: [
                    { required: true, message: '请输入题目名称', trigger: 'change' },
                ],
            }
        }
    },
    methods: {
        submit() {
            console.log("qwq");
        }
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
