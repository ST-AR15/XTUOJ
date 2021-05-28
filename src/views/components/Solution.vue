<template>
    <div class="solution" id="solution">
        <a-modal
            :title = "title"
            :visible = "visible"
            :footer = "null"
            :width = "width"
            class = "status-solution"
            @cancel = "handleCancel"
        >
            <a-spin :spinning="loading">
                <!-- 顶部介绍 -->
                <p class="modal-title">
                    <span>{{ introduce }}, </span>
                    <span class="problem-wa" v-if="compileError">compile_error, </span>
                    <span class="problem-wa" v-if="systemError">system_error, </span>
                    <span v-if="compileErrorInfo">compile_error_info: {{ compileErrorInfo }}, </span>
                    <a-button type="link" @click="handleCopy">copy</a-button>
                </p>
                <hr />
                <!-- 代码展示 -->
                <codemirror
                    ref="solutionCode"
                    v-model="code"
                    :options="cmOptions"
                >
                </codemirror>
                <hr />
                <p class="bold" style="margin: 5px 0;">→Judgement Protocol</p>
                <!-- 详情展示 -->
                <div v-for="(item, i) in test" :key="i">
                    <a-divider />
                    <p class="bold">
                        <span v-text="`#${ i + 1 }, time:${ item.time }ms, memory:${ item.memory }kb, verdict:`"></span>
                        <span :class="item.verdict == 'ACCEPT'? 'problem-accept': 'problem-wa'" v-text="`${ item.verdict }`"  style='opacity: 0.7'></span>
                    </p>
                    <p v-if="item.input">Input</p>
                    <pre v-if="item.input" v-text="item.input"></pre>
                    <p v-if="item.output">Output</p>
                    <pre v-if="item.output" v-html="item.output"></pre>
                    <p v-if="item.answer">Answer</p>
                    <pre v-if="item.answer" v-text="item.answer"></pre>
                </div>
            </a-spin>
        </a-modal>
    </div>
    
</template>

<script>
import { copy } from '@/utils/tools.js'
// import { Base64 } from 'js-base64'
import { codemirror } from 'vue-codemirror'
import 'codemirror/theme/ambiance.css'
require('codemirror/mode/clike/clike')
require('codemirror/mode/python/python')
export default {
    props: {
        title: {
            type: String,
            default: 'Solution Detail'
        },
        visible: {
            type: Boolean,
            default: false,
        },
        width: {
            type: String,
            default: "1100px"
        },
        loading: {
            type: Boolean,
            default: false,
        },
        introduce: {
            type: String,
            default: "",
        },
        code: {
            type: String,
            default: "",
        },
        compileError: {
            type: Boolean,
            default: false,
        },
        systemError: {
            type: Boolean,
            default: false,
        },
        compileErrorInfo: {
            type: String,
            default: "",
        },
        language: {
            type: String,
            default: "GCC"
        },
        time: {
            type: Number,
            default: 0,
        },
        memory: {
            type: Number,
            default: 0,
        },
        test: {
            type: Array,
            default: function() {
                return []
            }
        }
    },
    components: {
        codemirror
    },
    data() {
        return {
            cmOptions:{
                value:'',
                mode:"text/x-csrc",
                indentUnit: 4,
                readOnly:true,
                lineNumbers: true,
                matchBrackets: true,
            },
        }
    },
    methods: {
        handleCopy() {
            copy(this.code);
        },
        handleCancel() {
            this.$emit('cancel')
        }
    }
}
</script>

<style>

</style>