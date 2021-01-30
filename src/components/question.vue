<template>
    <div class="question" id="question">
        <a-page-header 
            title="返回"
            @back="back"
        />
        <div class="container">
            <div class="left" v-bind:style="{ width: leftW + 'px' }">
                <div class="menu">
                    <a-menu mode="horizontal" v-model="leftInner">
                        <a-menu-item key="question">问题</a-menu-item>
                        <a-menu-item key="discuss">讨论</a-menu-item>
                        <a-menu-item key="submit">提交情况</a-menu-item>
                    </a-menu>
                </div>
                <div class="leftContainer">
                    <section v-show="leftInner[0] == 'question'" class="questionSection">
                        <!-- 题目ID和title -->
                        <h1>
                            ID {{ ID }}:{{ question.title }}
                        </h1>
                        <!-- 题目标签 -->
                        <p>
                            <a-tag
                                v-for="tip in question.tips"
                                :key="tip"
                                v-bind:id="'tip-' + tip"
                            >
                                {{tip}}
                            </a-tag>
                        </p>
                        <p>
                            时间限制：<span v-text="question.timeLimit"></span>ms
                            内存限制：<span v-text="question.memoryLimit"></span>MB
                        </p>
                        <!-- 题目内容 -->
                        <!-- <h2>题目详情</h2> -->
                        <mavon-editor v-model="question.questionDetail" :subfield="false" :toolbarsFlag="false" defaultOpen="preview"></mavon-editor>
                    </section>
                    <section v-show="leftInner[0] == 'discuss'" class="discussSection">
                        <div class="comment">
                            <mavon-editor v-model="comment" :toolbars="commentToolbar" :subfield="false" placeholder="想说什么，尽管说吧~"></mavon-editor>
                        </div>
                        <div class="context">
                            <div class="contextInner" v-for="data in commentContext" v-bind:key="data.Rid">
                                <div class="contextItem">
                                    <div class="contextHeader">
                                        <span v-text="data.Uid"></span>
                                        <span v-text="data.time"></span>
                                    </div>
                                    <div class="contextMain">
                                        <p v-text="data.context"></p>
                                    </div>
                                    <div class="contextFooter">
                                        <a-space>
                                            <span 
                                                v-if="commentPost.find(o => o.postId == data.Rid)"
                                                v-text="`${ !data.isRecomment? '查看':'收起' }${ commentPost.find(o => o.postId == data.Rid).comment.length }条回复`"
                                                @click="data.isRecomment = !data.isRecomment">
                                            </span>
                                            <span
                                                @click="data.isReply = !data.isReply"
                                                v-text="`${ !data.isReply? '回复':'收起回复' }`"
                                            ></span>
                                        </a-space>
                                    </div>
                                </div>
                                <div class="contextTextarea" v-show="data.isReply">
                                    <mavon-editor v-model="commentReply" :toolbars="commentToolbar" :subfield="false" placeholder="想说什么，尽管说吧~"></mavon-editor>
                                    <a-space style="margin-top: 5px; text-align: right">
                                        <a-button type="primary">确定</a-button>
                                        <a-button type="primary">取消</a-button>
                                    </a-space>
                                </div>
                                <div class="reComment" v-show="data.isRecomment">
                                    <div class="contextItem">
                                        <div class="contextHeader">
                                            <span v-text="data.Uid"></span>
                                            <span v-text="data.time"></span>
                                        </div>
                                        <div class="contextMain">
                                            <p v-text="data.context"></p>
                                        </div>
                                        <div class="contextFooter">
                                            <span>回复</span>
                                        </div>
                                    </div>
                                    <div class="contextItem">
                                        <div class="contextHeader">
                                            <span v-text="data.Uid"></span>
                                            <span v-text="data.time"></span>
                                        </div>
                                        <div class="contextMain">
                                            <p v-text="data.context"></p>
                                        </div>
                                        <div class="contextFooter">
                                            <span>回复</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="contextPagination" v-show="data.isRecomment">
                                    <span>{{ commentPost.find(o => o.postId == data.Rid).postId }}</span>
                                    <a-pagination :hideOnSinglePage="true" v-model="data.page" :defaultPageSize="10" simple />
                                </div>
                            </div>
                        </div>
                    </section>
                    <section v-show="leftInner[0] == 'submit'" class="submitSection"></section>
                </div>
                <div class="buttons">
                    <a-space>
                        <a-input placeholder="请输入题号"></a-input>
                        <a-button type="primary">跳转</a-button>
                    </a-space>
                </div>
            </div>
            <div class="bar" draggable="true" @dragend="dragBar">
            </div>
            <div class="right"  v-bind:style="{ width: rightW + 'px' }">
                <div style="height: 48px">
                    <p>
                        语言：
                        <a-select v-model="question.language" style="width: 120px" defult-value="c">
                            <template v-for="item in question.language_allowed">
                                <a-select-option :key="item" :value="item">
                                    {{ item }}
                                </a-select-option>
                            </template>
                        </a-select>
                    </p>
                </div>
                <!-- <mavon-editor style="height:700px;margin-bottom:20px;z-index:1" :subfield="false" :toolbarsFlag="false" placeholder="Code here……" :tabSize="4" v-model="question.code"></mavon-editor> -->
                <codemirror
                    ref="mycode"
                    v-model="question.code"
                    :options="cmOptions"
                    style="height: calc(100% - 48px - 64px); position: relative"
                    >
                </codemirror>
                <div class="buttons">
                    <a-space>
                        <a-button type="primary" @click="question.code = ''">重置</a-button>
                        <a-button type="primary" @click="submit">提交</a-button>
                        <!-- TODO 根据文件后缀自动转换语言 -->
                        <a-upload
                            name="codeFile"
                            :beforeUpload="uploadFile"
                            :showUploadList="false"
                        >
                            <a-button type="primary">上传文件</a-button>
                        </a-upload>
                    </a-space>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import { codemirror } from 'vue-codemirror'
import 'codemirror/theme/ambiance.css'
require('codemirror/mode/javascript/javascript')
require('codemirror/mode/clike/clike')
export default {
    components: {
        mavonEditor,
        codemirror
    },
    props: {
        ID: Number,
        backMethod: String,
    },  // 从父组件获得题目ID，然后在接口里获得全部值
    data() {
        return {
            leftInner: ["question"],  // 左边显示的内容
            comment: "评论",   // 编辑框内容
            commentReply: "回复",  // 回复框内容
            commentRip: 0,   // 回复对象的ID
            leftW: 500,   // 左边宽度
            rightW: 500,   // 右边宽度
            loading: true, // 加载状态
            cmOptions:{
                value:'',
                mode:"text/x-csrc",
                // mode详细：https://codemirror.net/mode/clike/，clike换成python之类就能获得对应的内容
                indentUnit: 4,
                readOnly:false,
                lineNumbers: true,
                matchBrackets: true,
            },
            question: {
                language: "C",
                timeLimit: 128,
                memoryLimit: 128,
                language_allowed: ["C","C++","Java","JavaScript","PHP","Ruby"],
                title: "题目打开中",
                tips: [],
                questionDetail: "请稍候……",
                code: "",  //当前输入的代码
            },
            commentContext: [
                {
                    Rid: 1,
                    Uid: 201705551222,
                    Pid: 1006,
                    context: "谢谢",
                    postId: null,
                    time: "2020-12-29 09:04:28",
                    ip: null,
                    isRecomment: false,
                    isReply: false,
                    page: 1,
                },
                {
                    Rid: 5,
                    Uid: 2077,
                    Pid: 1006,
                    context: "你马没了",
                    postId: null,
                    time: "2020-12-29 09:07:28",
                    ip: null,
                    isRecomment: false,
                },
                {
                    Rid: 6,
                    Uid: 2077,
                    Pid: 1006,
                    context: "你马没了",
                    postId: null,
                    time: "2020-12-29 09:07:28",
                    ip: null,
                },
                {
                    Rid: 7,
                    Uid: 2077,
                    Pid: 1006,
                    context: "你马没了",
                    postId: null,
                    time: "2020-12-29 09:07:28",
                    ip: null,
                },
                {
                    Rid: 8,
                    Uid: 2077,
                    Pid: 1006,
                    context: "你马没了",
                    postId: null,
                    time: "2020-12-29 09:07:28",
                    ip: null,
                },
                {
                    Rid: 9,
                    Uid: 2077,
                    Pid: 1006,
                    context: "你马没了",
                    postId: null,
                    time: "2020-12-29 09:07:28",
                    ip: null,
                },
                {
                    Rid: 15,
                    Uid: 2077,
                    Pid: 1006,
                    context: "你马没了",
                    postId: null,
                    time: "2020-12-29 09:07:28",
                    ip: null,
                },
                {
                    Rid: 25,
                    Uid: 2077,
                    Pid: 1006,
                    context: "你马没了你马没了你马没了你马没了你马没了你马没了你马没了你马没了你马没了你马没了你马没了你马没了你马没了你马没了你马没了你马没了",
                    postId: null,
                    time: "2020-12-29 09:07:28",
                    ip: null,
                },
            ],
            commentPost: [
                {
                    postId: 1,
                    comment: [
                        {
                            Rid: 3,
                            Uid: 2010,
                            Pid: 1006,
                            context: "我谢你马",
                            time: "2020-12-29 09:05:22",
                            ip: null,
                        },
                        {
                            Rid: 31,
                            Uid: 2010,
                            Pid: 1006,
                            context: "你马没了",
                            time: "2020-12-29 19:05:22",
                            ip: null,
                        }
                    ]
                    
                },
                {
                    postId: 5,
                    comment: [
                        {
                            Rid: 123,
                            Uid: 2010,
                            Pid: 1006,
                            context: "我谢你马",
                            time: "2020-12-30 09:05:22",
                            ip: null,
                        },
                    ]
                    
                },
            ],
            commentToolbar: {
                bold: true, // 粗体
                italic: true, // 斜体
                header: false, // 标题
                underline: true, // 下划线
                strikethrough: true, // 中划线
                mark: false, // 标记
                superscript: false, // 上角标
                subscript: false, // 下角标
                quote: true, // 引用
                ol: true, // 有序列表
                ul: true, // 无序列表
                link: false, // 链接
                imagelink: false, // 图片链接
                code: true, // code
                table: true, // 表格
                fullscreen: true, // 全屏编辑
                readmodel: true, // 沉浸式阅读
                htmlcode: false, // 展示html源码
                help: true, // 帮助
                /* 1.3.5 */
                undo: true, // 上一步
                redo: true, // 下一步
                trash: true, // 清空
                save: false, // 保存（触发events中的save事件）
                /* 1.4.2 */
                navigation: false, // 导航目录
                /* 2.1.8 */
                alignleft: false, // 左对齐
                aligncenter: false, // 居中
                alignright: false, // 右对齐
                /* 2.2.1 */
                subfield: false, // 单双栏模式
                preview: true, // 预览
            }
            
        }
    },
    methods: {
        back() {  //返回上一页的方法
            this.$emit("back");
        },
        uploadFile(file) {  // 上传文件
            console.log('cnm');
            // 暂时设定的逻辑是，把文件读取出来，然后誊写到代码框里
            // TODO 理论上这里应该设置一下文件上传后根据文件后缀修改语言（编译器）？或者没必要？
            const reader = new FileReader();
            reader.readAsText(file);
            reader.onload = (result) => {
                console.log(result.target.result);
                // 如果之前有代码，则提示已经替换
                if(this.question.code) {
                    this.$message.info('已经替换了之前的代码，可通过ctrl+z撤销');
                }
                this.question.code = result.target.result;
            }
            // 返回false表示不调用默认的上传接口
            return false;
        },
        submit() {  // 提交代码
            console.log(this.question.code);
        },
        openQuestion() {  // 加载问题
            console.log("打开了题目" + this.ID);
            this.loading = true; // 开始加载题目
            let url = this.$baseUrl + '/api/problem/' + this.ID;
            this.$axios.get(url).then(rep => {
                const data = rep.data.data;
                // Pid
                this.question.title = data.Tittle;
                // source
                this.question.questionDetail = data.Content;
                this.question.timeLimit = data.TimeLimit;
                this.question.memoryLimit = data.MemoryLimit;
                // IsBan
                // Accept
                // Submit
                // Solved
                // created_at
                // update_at
                this.loading = false; // 加载题目完成
            })
        },
        dragBar(e) {  // 拖拽
            console.log(e);
            console.log(this.leftW);
            this.leftW = e.clientX;
            this.rightW = window.innerWidth - 20 - this.leftW;
            
        }
    },
    watch: {
        ID: function(){
            // 重置代码
            this.question.code = "";
            console.log("ID changed");
            this.openQuestion();
        }
    },
    mounted() {
        let that = this;
        that.rightW = window.innerWidth - 20 - that.leftW;
        window.onresize = function() {
            that.rightW = window.innerWidth - 20 - that.leftW;
        }
    }
    
}
</script>

<style>
.question {
    width: 100%;
    background-color: #FAFAFA;
    position: relative;
    margin: 0 auto;
    overflow: hidden;
}
.question > .container {
    width: 100%;
    height: calc(100% - 64px);
    overflow: hidden;
    display: flex;
}
.question > .container > div {
    height: 100%;
    position: relative;
}
.question .left {
    min-width: 500px;
}
.question .leftContainer {
    /* 48是menu,64是buttons */
    height: calc(100% - 48px - 64px);
    overflow: auto;
}
.question .leftContainer > section {
    overflow: visible;
}
.question .bar {
    width: 10px;
    cursor: col-resize;
    background-color: blanchedalmond;
    transition: all .6s;
}
.question .bar:hover {
    background-color: burlywood;
}
.question .right {
    min-width: 300px;
}
.question .questionSection > h1 {
    font-size: 26px;
    border-left: 8px solid #1890FF;
    padding-left: 4px;
}
.question .questionSection > h2 {
    font-size: 26px;
    margin-top: 45px;
    border-left: 8px solid #1890FF;
    padding-left: 4px;
    user-select: none;
}
.question .questionSection > p {
    font-size: 20px;
}
.question .discussSection {
    padding: 0 20px;
}
.question .discussSection .context {
    margin-top: 20px;
}
.question .discussSection .contextInner {
    width: 100%;
    min-height: 100px;
    margin: 10px 0;
    border-bottom: 1px solid #666666;
}
.question .discussSection .reComment {
    display: flex;
    flex-direction: column;
    border: 1px solid #777777;
    box-shadow: inset 0 1px 6px #999999;
    border-radius: 12px;
    padding: 0 5%;
    margin: 5px 0;
}
.question .discussSection .contextTextarea {
    margin-bottom: 5px;
}
.reComment > .contextItem {
    border-bottom: 1px solid #666666;
}
.question .discussSection .contextItem {
    width: 100%;
    min-height: 100px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
.question .discussSection .contextHeader {
    height: 30px;
    line-height: 30px;
    display: flex;
    justify-content: space-between;
}
.question .discussSection .contextFooter {
    height: 30px;
    line-height: 30px;
}
.question .contextFooter span {
    cursor: pointer;
}
.question .contextFooter span:hover {
    color: #1890FF;
}

.question .buttons {
    width: 100%;
    height: 64px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    border-top: 1px solid #e8e8e8;
}
.question .buttons > input {
    width: 120px;
}
.CodeMirror {
    height: 100% !important;
}
</style>