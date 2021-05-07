<template>
    <div class="question" id="question">
        <a-page-header 
            title="返回"
            @back="back"
            style="box-shadow: 0 -4px #EEE inset"
        />
        <div class="question-container">
            <div class="question-left" :style="{ width: leftW + 'px' }">
                <a-tabs v-model="tabkey" @change="handleTab">
                    <a-tab-pane class="question-left-container" key="question" tab="问题">
                        <a-spin :spinning="loading">
                            <section class="question-section-question">
                                <!-- 题目ID和title -->
                                <h1>
                                    ID {{ ID }}:{{ question.title }}
                                </h1>
                                <!-- 题目标签 -->
                                <p>
                                    <a-tag
                                        v-for="tip in question.tips"
                                        :key="tip"
                                        :id="'tip-' + tip"
                                    >
                                        {{tip}}
                                    </a-tag>
                                </p>
                                <p v-text="`时间限制:${ question.timeLimit }ms 内存限制:${ question.memoryLimit }MB`"></p>
                                <mavon-editor v-model="question.questionDetail" :subfield="false" :toolbarsFlag="false" defaultOpen="preview"></mavon-editor>
                            </section>
                        </a-spin>
                    </a-tab-pane>
                    <a-tab-pane class="question-left-container" key="discuss" tab="讨论">
                        <a-spin :spinning="commentLoading">
                            <section class="question-section-discuss" id="question-section-discuss">
                                <div class="comment" style="margin-top: 10px">
                                    <a-textarea :disabled="!$store.state.uid" :placeholder="$store.state.uid? '想说什么，尽管说吧~': '请先登录~'" v-model="comment" :rows="4" />
                                    <a-button style="margin-top: 5px" type="primary" @click="sendComment(false)">发表</a-button>
                                </div>
                                <div class="context">
                                    <template v-for="(data, i) in commentContext">
                                        <div class="context-inner" :key="data.Rid">
                                            <div class="context-item">
                                                <div class="context-header">
                                                    <span v-text="data.Uid"></span>
                                                    <span v-text="data.time"></span>
                                                </div>
                                                <div class="context-main">
                                                    <p v-text="data.context"></p>
                                                </div>
                                                <div class="context-footer">
                                                    <a-space>
                                                        <span 
                                                            v-if="data.comment.length != 0"
                                                            v-text="`${ !data.isRecomment? '查看':'收起' }${ data.comment.length }条回复`"
                                                            @click="data.isRecomment = !data.isRecomment">
                                                        </span>
                                                        <span
                                                            @click="openTextarea(i + 1, 0, data.Rid)"
                                                            v-text="`${ !(commentReplyNum[0] == i + 1 && commentReplyNum[1] == 0)? '回复':'收起回复' }`"
                                                        ></span>
                                                        <span
                                                            @click="deleteComment(data.Rid)"
                                                            v-if="data.Uid == $store.state.uid"
                                                        >删除评论</span>
                                                    </a-space>
                                                </div>
                                            </div>
                                            <div class="context-textarea" v-show="commentReplyNum[0] == i + 1 && commentReplyNum[1] == 0">
                                                <a-textarea :disabled="!$store.state.uid" :placeholder="$store.state.uid? '回复用户' + data.Uid + '的评论': '请先登录~'" v-model="commentReply" :rows="4" style="resize: none" />
                                                <a-button style="margin-top: 5px;" type="primary" @click="sendComment(true)">回复</a-button>
                                            </div>
                                            <div class="context-recomment" v-show="data.isRecomment">
                                                <div class="context-inner" v-for="(item, j) in data.comment" :key="item.Rid">
                                                    <div class="context-item">
                                                        <div class="context-header">
                                                            <span v-text="item.Uid"></span>
                                                            <span v-text="item.time"></span>
                                                        </div>
                                                        <div class="context-main">
                                                            <p v-text="`${ item.postId == data.Rid? '':'回复' + data.comment.find(o => o.Rid == item.postId).Uid + ': ' }${ item.context }`"></p>
                                                        </div>
                                                        <div class="context-footer">
                                                            <a-space>
                                                                <span
                                                                    @click="openTextarea(i + 1, j + 1, item.Rid);item.isReply = !item.isReply; commentPost = item.Rid"
                                                                    v-text="`${ !item.isReply? '回复':'收起回复' }`"
                                                                ></span>
                                                            </a-space>
                                                        </div>
                                                    </div>
                                                    <div class="context-textarea" v-show="commentReplyNum[0] == i + 1 && commentReplyNum[1] == j + 1">
                                                        <a-textarea :placeholder="'回复用户' + item.Uid + '的评论'" v-model="commentReply" :rows="4" style="resize: none" />
                                                        <a-button style="margin-top: 5px;" type="primary" @click="sendComment(true)">回复</a-button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </template>
                                </div>
                                <p style="text-align: center; color: #aaa">没有更多了</p>
                            </section>
                        </a-spin>
                    </a-tab-pane>
                    <a-tab-pane class="question-left-container" key="submit" tab="提交情况">
                        <!-- <a-spin :spinning="submitLoading"> -->
                        <a-table
                            :columns="submitColumns"
                            :data-source="submitData"
                            rowKey="JID"
                            style="min-width: 600px"
                            :pagination="submitPagination"
                        >
                            <!-- solution -->
                            <!-- 只有普通的question才能看 -->
                            <span 
                                slot="solution"
                                slot-scope="solution"
                                :style="{ 
                                    cursor: $route.name == 'question'? 'pointer':'default',
                                    color: $route.name == 'question'? '#40A9FF':''
                                }"
                            >
                                <span @click="submitSolution.visible = true" v-text="solution"></span>
                            </span>
                            <!-- 结果 -->
                            <span slot="result" slot-scope="result">
                                <a-spin v-if="result == 0 || result == -2" />
                                <span v-text="$resultText[result]"></span>
                            </span>
                        </a-table>
                        <a-modal
                            title = "solution"
                            :visible = "submitSolution.visible"
                            :footer = "null"
                            width= "1100px"
                            class="status-solution"
                            @cancel = "submitSolution.visible = false"
                        >
                            <p class="modal-title">
                                By {{ submitSolution.author }}, contest:{{ submitSolution.contest }}, problem: {{ submitSolution.problem }},
                                <span :class="submitSolution.result=='Accept'? 'accept':status=='Wrong Answer'? 'wa':'others'">{{ submitSolution.result }}</span>,
                                <a>#</a>,
                                <a @click="copy(submitSolution.code)">copy</a>
                            </p>
                            <hr />
                            <codemirror
                                ref="code"
                                v-model="submitSolution.code"
                                :options="cmOptions"
                                >
                            </codemirror>
                            <hr />
                            <p class="bold" style="margin: 5px 0;">→Judgement Protocol</p>
                            <div v-for="(item, i) in submitSolution.test" :key="i">
                                <a-divider />
                                <p class="bold" v-text="`#${ i + 1 }, time: ${ item.time }ms, memory: ${ item.memory }KB, exit code: ${ item.exit }, checker exit code: ${ item.checker }, verdict: ${ item.verdict }`"></p>
                                <p v-if="item.input">Input</p>
                                <pre v-if="item.input" v-text="item.input"></pre>
                                <p v-if="item.output">Output</p>
                                <pre v-if="item.output" v-html="item.output"></pre>
                                <p v-if="item.answer">Answer</p>
                                <pre v-if="item.answer" v-text="item.answer"></pre>
                                <p v-if="item.checkLog">CheckLog</p>
                                <pre v-if="item.checkLog" v-text="item.checkLog"></pre>
                            </div>
                        </a-modal>
                        <!-- </a-spin> -->
                    </a-tab-pane>
                </a-tabs>
                <div class="buttons">
                    <a-space>
                        <a-input-number placeholder="请输入题号" v-model="aimID" @pressEnter="handleRoute(aimID)"></a-input-number>
                        <a-button type="primary" @click="handleRoute(aimID)">跳转</a-button>
                    </a-space>
                </div>
            </div>
            <div class="question-bar" draggable="true" @dragend="dragBar">
            </div>
            <div class="question-right" :style="{ width: rightW + 'px' }">
                <div class="question-right-header">
                    <span>语言：</span>
                    <a-select v-model="question.language" style="width: 120px" defult-value="GCC">
                        <template v-for="item in question.language_allowed">
                            <a-select-option :key="item" :value="item">
                                {{ item }}
                            </a-select-option>
                        </template>
                    </a-select>
                    <span style="margin-left: 15px">自动保存：</span>
                    <a-switch checked-children="是" un-checked-children="否" default-checked @change="autoSave = !autoSave; handleCode()" />
                    <a-tooltip placement="topLeft">
                        <template slot="title">
                            <span>开启后，系统会自动保存你未提交的代码，提交后会自动删除</span>
                        </template>
                        <a-icon style="margin-left: 5px;cursor: pointer" type="question-circle" />
                    </a-tooltip>
                </div>
                <!-- <mavon-editor style="height:700px;margin-bottom:20px;z-index:1" :subfield="false" :toolbarsFlag="false" placeholder="Code here……" :tabSize="4" v-model="question.code"></mavon-editor> -->
                <codemirror
                    ref="mycode"
                    v-model="question.code"
                    :options="cmOptions"
                    @input="handleCode"
                    style="height: calc(100% - 46px - 64px); position: relative"
                    >
                </codemirror>
                <span style="color: #999999;position: absolute;width: 40%; left: 30%; text-align: center; top:45%; user-select: none" v-if="question.code == ''">*可以通过拖拽文件方式来快速填写代码</span>
                <div class="buttons">
                    <a-space>
                        <!-- TODO 根据文件后缀自动转换语言 -->
                        <a-upload
                            name="codeFile"
                            :beforeUpload="handleFile"
                            :showUploadList="false"
                        >
                            <a-button type="primary">上传文件</a-button>
                        </a-upload>
                        <a-button type="primary" @click="question.code = ''">重置</a-button>
                        <a-button type="primary" @click="querySubmit">提交</a-button>
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
import { Base64 } from 'js-base64'
require('codemirror/mode/javascript/javascript')
require('codemirror/mode/clike/clike')
export default {
    components: {
        mavonEditor,
        codemirror
    },
    // 从父组件获得题目ID，然后在接口里获得全部值
    data() {
        return {
            jump: 0,                  // 跳转的次数，用于返回
            aimID: 1000,              // 与底部跳转绑定的数值
            ID: 1000,                 // 题目的ID
            comment: "",              // 编辑框内容
            commentReply: "",         // 回复框内容
            commentPost: 0,           // 回复对象的RID
            leftW: 500,               // 左边宽度
            rightW: 500,              // 右边宽度
            loading: false,           // 题目加载状态
            commentLoading: false,    // 评论区的加载状态
            submitColumns: [
                {
                    title: "Solution",
                    dataIndex: "JID",
                    scopedSlots: { customRender: 'solution' },
                },
                {
                    title: "提交结果",
                    dataIndex: "result",
                    scopedSlots: { customRender: 'result' },
                },
                {
                    title: "执行用时",
                    dataIndex: "runTime",
                },
                {
                    title: "内存消耗",
                    dataIndex: "runMemory",
                },
                {
                    title: "使用语言",
                    dataIndex: "language",
                },
                {
                    title: "提交时间",
                    dataIndex: "submitTime",
                }
            ],                        // 提交区表格头
            submitPagination: {
                pageSize:0,     // 每页题目数量
                showQuickJumper: true,  // 快速跳转
                total: 0,
                current: 1,
            },                        // 提交的分页器
            submitData: [],           // 提交区的数据
            submitSolution: {
                visible: false,
                author: "slight",
                contest: "Contest 2050 and Codeforces Round #718 (Div. 1 + Div. 2)",
                problem: "(A) Sum of 2050",
                result: "Accept",
                info: "Runtime error on test 1",
                code: "int main()\n{\n    int a = 1;\n    return 0;\n}\n",
                test: [
                    {
                        time: 93,
                        memory: 0,
                        exit: 1,
                        checker: 0,
                        verdict: "RUNTIME_ERROR",
                        input: "1",
                        output: "1",
                        answer: "1",
                        checkLog: "ok 1 numbers",
                    },
                    {
                        time: 93,
                        memory: 0,
                        exit: 1,
                        checker: 0,
                        verdict: "RUNTIME_ERROR",
                        input: "1",
                        checkLog: "Exit code is 1",
                    }
                ]
            },
            submitTimer: "",          // 提交情况的计时器
            commentReplyNum: [0,0],   // 当前打开的是哪个输入框，第一个数字代表一级评论，第二个数字代表二级
            commentContext: [],       // 评论区内容
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
                language: "GCC",
                timeLimit: 128,
                memoryLimit: 128,
                language_allowed: this.$language,
                title: "题目打开中",
                tips: [],
                questionDetail: "请稍候……",
                code: "",  //当前输入的代码
            },
            tabkey: 'question',
            autoSave: true,
            
        }
    },
    methods: {
        back() {  //返回上一页的方法
            // this.$emit("back");
            this.$router.go(-1 * (this.jump + 1));
        },
        handleCode() {
            // 输入代码时，自动存储代码到localStorage
            // 为了localStorage不会溢出，提交了就不存了
            // 只有在开启了自动保存才生效
            if(this.autoSave) {
                let code = JSON.parse(localStorage.getItem('code'));
                let num = code.findIndex(o => o.id == this.ID);
                if(num >= 0) {
                    // 如果找到了就改原来的
                    code[num] = {
                        id: this.ID,
                        code: this.question.code,
                        timeStamp: Date.now(),
                    }
                } else {
                    // 没找到就加一个，而且如果是没写代码的话就不加
                    if(this.question.code) {
                        code.push({
                            id: this.ID,
                            code: this.question.code,
                            timeStamp: Date.now(),
                        })
                    }
                }
                localStorage.setItem('code', JSON.stringify(code));
            }
        },
        handleFile(file) {  // 上传文件
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
        querySubmit() {  // 提交代码
            let url
            if(this.$route.name == "question_contest") {   // 比赛模式提交
                url = `/api/contest/${ this.$route.params.CID }/problem/${ this.ID }/submit`;
            } else {  // 普通模式加载
                url = `/api/problem/${ this.ID }/submit`;
            }
            const info = {
                Code: Base64.encode(this.question.code),
                Language: this.question.language
            }
            this.$axios.post(url, info).then(rep => {
                if(parseInt(rep.status/100) == 2) {
                    this.$message.info('提交成功！');
                    // 清空代码
                    this.question.code = "";
                    // 跳转到提交情况
                    this.tabkey = "submit";
                    this.querySubmitInformation();
                }
            })
            
        },
        querySubmitInformation() {  // 加载提交情况
            let that = this;
            // 根据情况使用不同API
            let url = "";
            if(this.$route.name == "question_contest") {   // 比赛模式加载
                url = `/api/contest/${ this.$route.params.CID }/submit`;
            } else {  // 普通模式加载
                url = `/api/problem/${ this.ID }/submit`;
            }
            this.$axios.get(url, {
                params: {
                    page: this.submitPagination.current
                }
            }).then(rep => {
                // 设置页面信息
                this.submitPagination.pageSize = rep.data.data.per_page;
                this.submitPagination.total = rep.data.data.total;
                const data = rep.data.data.data;
                for(let i in data) {
                    const submitItem = {
                        JID: data[i].Jid,
                        result: data[i].result,
                        runTime: data[i].RunTime,
                        runMemory: data[i].RunMemory,
                        language: data[i].Language,
                        submitTime: data[i].updated_at,
                    }
                    this.submitData[parseInt(this.submitPagination.pageSize*(this.submitPagination.current-1)) + parseInt(i)] = submitItem;
                }
                console.log(this.submitData);
                // 如果有内容，而且有题目需要加载
                // 有内容
                if(this.submitData.length != 0) {
                    // 有题目要加载且还没计时器
                    // 找到第一个需要加载的题目的页码
                    let index = this.submitData.findIndex(o => o.result == 0 || o.result == -2);
                    if(index >= 0 && !this.submitTimer) {
                        // 设置计时器去查没有加载完的题目
                        this.submitTimer = setInterval(function() {
                            console.log(Date.now());
                            // 根据index计算page
                            const page = parseInt(index / that.submitPagination.pageSize) + 1;
                            that.$axios.get(url, {
                                params: {
                                    page: page
                                }
                            }).then(rep => {
                                // 页面设置
                                that.submitPagination.total = rep.data.data.total;
                                // 获取新数据
                                const data = rep.data.data.data;
                                for(let i in data) {
                                    const submitItem = {
                                        JID: data[i].Jid,
                                        result: data[i].result,
                                        runTime: data[i].RunTime,
                                        runMemory: data[i].RunMemory,
                                        language: data[i].Language,
                                        submitTime: data[i].updated_at,
                                    }
                                    that.$set(that.submitData, parseInt((page - 1) * that.submitPagination.pageSize) + parseInt(i), submitItem)
                                }
                                // 判断是否还有判断中的题目,没有就删除计时器
                                if(that.submitData.findIndex(o => o.result == 0 || o.result == -2) < 0) {
                                    clearInterval(that.submitTimer);
                                    that.submitTimer = "";
                                }
                            })
                        }, 1000)
                    }
                }
            })
        },
        queryQuestion() {  // 加载问题
            this.loading = true; // 开始加载题目
            this.question.questionDetail = ""; // 暂时删除内容
            this.tabkey = 'question'; // 切换到问题内容
            let url;
            if(this.$route.name == "question_contest") {   // 比赛模式加载
                url = `/api/contest/${ this.$route.params.CID }/problem/${ this.ID }`;
            } else {  // 普通模式加载
                url = '/api/problem/' + this.ID;
            }
            this.$axios.get(url).then(rep => {
                let data;
                if(this.$route.name == "question_contest") {   // 比赛模式
                    data = rep.data.data[0];
                } else {  // 普通模式加载
                    data = rep.data.data;
                }
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
                this.loading = false;     // 加载题目完成
            }).catch(e => {
                // 如果是直接输入地址过来的，就回到首页，否则回退
                if(this.jump == 0) {
                    this.$message.error('加载失败！已回到首页，请检查题号');
                    this.$router.push({ name: "home" });
                } else {
                    this.$message.error('加载失败！已跳转回上一道题，请检查题号');
                    this.$router.go(-1);
                    this.jump-= 2; // 过去的一次和go(-1)的一次要被减掉
                }
                return e;
            });
        },
        dragBar(e) {  // 拖拽
            this.leftW = e.clientX;
            this.rightW = Math.max(window.innerWidth, 1000) - 20 - this.leftW;
            
        },
        queryComment() {  // 加载评论
            // 如果加载过了，就不加载
            if(this.commentContext.length != 0) {
                return ;
            }
            let that = this;
            that.commentLoading = true;
            let url = '/api/reply/' + this.ID;
            this.$axios.get(url).then(rep => {
                const data = rep.data.data;  // 评论的数据
                for(let i in data) {
                    // console.log(data[i]);
                    let info = {
                        Rid: data[i].Rid,
                        Uid: data[i].Uid,
                        Pid: data[i].Pid,
                        context: data[i].Context,
                        postId: data[i].PostId,
                        time: data[i].create_at,
                        ip: data[i].Ip,
                    }
                    // console.log(info);
                    if(info.postId == null) {
                        // 如果没有postID，就说明是一级评论，直接push到comment数组里
                        // 先添加部分额外属性
                        info["isRecomment"] = false;  // 未展开评论
                        info["isReply"] = false,      // 未展开评论框
                        info["comment"] = [];         // 评论内容
                        that.commentContext.push(info);
                    } else {
                        try {
                            // 如果有postID，就要找到它属于哪个评论
                            let aim = that.commentContext.findIndex(o => (o.Rid == info.postId) || (o.comment.find(p => p.Rid == info.postId) != undefined));
                            // 然后把这个内容push到对应的评论的二级评论下
                            that.commentContext[aim].comment.unshift(info);
                        } catch {
                            // 如果上面的检索没检索到，就报错
                            this.$message.error(`出现错误，请联系网站管理员！RID=${info.Rid}，PID=${info.Pid}`);
                        }
                    }
                }
                // 由于最新的评论应该放在最前面，所以要逆序处理
                that.commentContext.reverse();
                // console.log(that.commentContext);
                that.commentLoading = false; // 停止加载
            })
            
        },
        deleteComment(Rid) { // 删除评论
            let url = '/api/reply';
            let params = {
                Rid: Rid,
            }
            console.log(params);
            this.$axios.delete(url, { data: params }).then(rep => {
                console.log(rep);
                // 刷新评论
                this.$message.success("删除成功！");
                this.commentContext = [];
                this.queryComment();
            })
        },
        sendComment(reply) {  // 提交评论
            // console.log(reply)
            let that = this;
            // console.log(that.commentPost);
            let info = {
                Pid: that.ID,
                Context: reply? that.commentReply: that.comment,
                PostId: reply? that.commentPost: undefined,
            };
            const url = "/api/reply";
            this.$axios.post(url, info).then(rep => {
                // console.log(rep);
                // 如果创建成功，就刷评论列表，然后清空评论栏
                if(Math.floor(rep.status)) {
                    that.$message.success('评论成功！');  // 提示成功
                    that.commentContext = [];  // 清空评论栏
                    this.commentPost = null;  // 清除post
                    this.commentReplyNum = [0,0]; // 关闭回复的输入框
                    that.queryComment();   // 重新加载评论
                    if(reply) {
                        that.commentReply = "";
                        that.commentPost = null;
                    } else {
                        that.comment = ""
                    }
                }                
            })
        },
        openTextarea(a, b, post) {  // 打开某评论文本框
            // 如果传入的值和原来一样，就默认是关闭
            if(this.commentReplyNum[0] == a && this.commentReplyNum[1] == b && this.commentPost == post) {
                this.commentPost = null;
                this.commentReplyNum = [0,0];
                this.$forceUpdate();
            } else {
                this.commentPost = post;
                this.commentReplyNum = [a,b];
                this.$forceUpdate();
            }
        },
        handleRoute(id) { // 修改route
            if(typeof id !== 'string') {
                id += "";
            }
            console.log(this.$router);
            console.log(this.$route);
            if(this.$route.params.ID == id) {
                this.$message.error(`你已经打开ID${id}了哦`);
            } else {
                this.$router.push(id);
            }
        },
        handleTab(aim) {
            // 切换成讨论
            if(aim == 'discuss') {
                this.queryComment();
            } else if(aim == 'submit') {
                this.querySubmitInformation();
            }
        }
    },
    watch: {
        $route(to) {
            // 修改ID
            this.ID = to.params.ID;
            // 修改aimID
            this.aimID = to.params.ID;
            // 打开问题
            this.queryQuestion();
            // 重置代码
            if(JSON.parse(localStorage.getItem('code')).find(o => o.id == this.ID)) {
                // 如果有，就使用上次的代码
                let code = JSON.parse(localStorage.getItem('code')).find(o => o.id == this.ID).code;
                if(code) {
                    // 如果有内容，就弹出提示
                    this.$message.info('已恢复上次未完成的代码');
                }
                this.question.code = code;
            } else {
                this.question.code = "";
            }
            // 重置评论
            this.commentContext = [];
            // 跳转一次
            this.jump++;
        },
    },
    mounted() {
        let that = this;
        // 设置宽度
        that.rightW = Math.max(window.innerWidth, 1000) - 20 - that.leftW;
        window.onresize = function() {
            that.rightW = Math.max(window.innerWidth, 1000) - 20 - that.leftW;
        }
        // 获取id
        that.ID = this.$route.params.ID;
        that.aimID = this.$route.params.ID;
        // 刚打开页面时，加载一次问题
        that.queryQuestion();
        // 检测是否有自动保存用的数组
        if(!localStorage.getItem('code')) {
            localStorage.setItem('code', '[]');
        }
    },
    
}
</script>

<style>
.question {
    width: 100%;
    height: calc(100vh - 66px);
    background-color: #FAFAFA;
    position: relative;
    margin: 0 auto;
    overflow: hidden;
}
.question-container {
    width: 100%;
    height: calc(100% - 64px);
    overflow: hidden;
    display: flex;
}
.question-container > div {
    height: 100%;
    position: relative;
}
.question-left {
    min-width: 400px;
}
.question-left .ant-tabs {
    position: relative;
    height: calc(100% - 64px);
}
.question-left .ant-tabs-content {
    height: calc(100% - 61px);
}
.question-left-container {
    overflow-y: auto;
    padding: 0 15px;
}
.question-left-container > section {
    overflow: visible;
}
.question-bar {
    width: 10px;
    cursor: col-resize;
    background-color: blanchedalmond;
    transition: all .6s;
}
.question-bar:hover {
    background-color: burlywood;
}
.question-right {
    min-width: 400px;
}
.question-section-question > h1 {
    font-size: 26px;
    border-left: 8px solid #1890FF;
    padding-left: 4px;
    text-align: left;
}
.question-section-question > p {
    font-size: 20px;
}
.question-section-discuss .context {
    margin-top: 20px;
}
.question-section-discuss .context-inner {
    width: 100%;
    min-height: 100px;
    margin: 10px 0;
    border-bottom: 1px solid #666666;
}
.question-section-discuss .context-recomment {
    display: flex;
    flex-direction: column;
    border: 1px solid #777777;
    box-shadow: inset 0 1px 6px #999999;
    border-radius: 12px;
    padding: 0 5%;
    margin: 5px 0;
}
.question-section-discuss .context-textarea {
    margin-bottom: 5px;
}
.question-section-discuss .context-item {
    width: 100%;
    min-height: 100px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
.question-section-discuss .context-header {
    height: 30px;
    line-height: 30px;
    display: flex;
    justify-content: space-between;
}
.question-section-discuss .context-footer {
    height: 30px;
    line-height: 30px;
}
.question-section-discuss .context-footer span {
    cursor: pointer;
    user-select: none;
}
.question-section-discuss .context-footer span:hover {
    color: #1890FF;
}
.question-right .question-right-header {
    height: 46px;
    line-height: 46px;
    padding-left: 5px
}
.question .buttons {
    width: 100%;
    height: 64px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    border-top: 1px solid #e8e8e8;
    padding: 0 5px;
}
.question .buttons > input {
    width: 120px;
}
.CodeMirror {
    height: 100% !important;
}
</style>