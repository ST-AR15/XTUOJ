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
                        <a-menu-item @click="openComment" key="discuss">讨论</a-menu-item>
                        <a-menu-item key="submit">提交情况</a-menu-item>
                    </a-menu>
                </div>
                <div class="leftContainer">
                    <a-spin :spinning="loading">
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
                    </a-spin>
                    <a-spin :spinning="commentLoading">
                        <section v-show="leftInner[0] == 'discuss'" class="discussSection">
                            <div class="comment" style="margin-top: 10px">
                                <a-textarea placeholder="想说什么，尽管说吧~" v-model="comment" :rows="4" />
                                <a-button style="margin-top: 5px" type="primary" @click="sendComment(false)">发表</a-button>
                            </div>
                            <div class="context">
                                <template v-for="(data, i) in commentContext">
                                    <div class="contextInner" v-bind:key="data.Rid" v-if="(i >=  (commentPage-1)*commentSize) && (i < commentPage*commentSize)">
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
                                                        
                                                    >删除评论</span>
                                                    <!-- TODO 这里一个if判断是否显示删除 -->
                                                    <!-- v-if="data.Uid == sessionStorage.getItem('uid')" -->
                                                </a-space>
                                            </div>
                                        </div>
                                        <div class="contextTextarea" v-show="commentReplyNum[0] == i + 1 && commentReplyNum[1] == 0">
                                            <a-textarea :placeholder="'回复用户' + data.Uid + '的评论'" v-model="commentReply" :rows="4" style="resize: none" />
                                            <a-button style="margin-top: 5px;" type="primary" @click="sendComment(true)">回复</a-button>
                                        </div>
                                        <div class="reComment" v-show="data.isRecomment">
                                            <div class="contextInner" v-for="(item, j) in data.comment" v-bind:key="item.Rid">
                                                <div class="contextItem">
                                                    <div class="contextHeader">
                                                        <span v-text="item.Uid"></span>
                                                        <span v-text="item.time"></span>
                                                    </div>
                                                    <div class="contextMain">
                                                        <p v-text="`${ item.postId == data.Rid? '':'回复' + data.comment.find(o => o.Rid == item.postId).Uid + ': ' }${ item.context }`"></p>
                                                    </div>
                                                    <div class="contextFooter">
                                                        <a-space>
                                                            <span
                                                                @click="openTextarea(i + 1, j + 1, item.Rid);item.isReply = !item.isReply; commentPost = item.Rid"
                                                                v-text="`${ !item.isReply? '回复':'收起回复' }`"
                                                            ></span>
                                                        </a-space>
                                                    </div>
                                                </div>
                                                <div class="contextTextarea" v-show="commentReplyNum[0] == i + 1 && commentReplyNum[1] == j + 1">
                                                    <a-textarea :placeholder="'回复用户' + item.Uid + '的评论'" v-model="commentReply" :rows="4" style="resize: none" />
                                                    <a-button style="margin-top: 5px;" type="primary" @click="sendComment(true)">回复</a-button>
                                                </div>
                                            </div>
                                            <div class="contextPagination" v-show="data.isRecomment">
                                                <a-pagination :hideOnSinglePage="true" v-model="data.page" :defaultPageSize="10" :total="data.comment.length" simple />
                                            </div>  
                                        </div>
                                    </div>
                                </template>
                                <div class="contextPagination">
                                    <a-pagination style="text-align: center" :hideOnSinglePage="true" v-model="commentPage" :defaultPageSize="commentSize" :total="commentContext.length" simple />
                                </div>
                            </div>
                        </section>
                    </a-spin>
                    <section v-show="leftInner[0] == 'submit'" class="submitSection"></section>
                </div>
                <div class="buttons">
                    <a-space>
                        <a-input-number placeholder="请输入题号" v-model="aimID" @pressEnter="routeTo(aimID)"></a-input-number>
                        <a-button type="primary" @click="routeTo(aimID)">跳转</a-button>
                    </a-space>
                </div>
            </div>
            <div class="bar" draggable="true" @dragend="dragBar">
            </div>
            <div class="right"  v-bind:style="{ width: rightW + 'px' }">
                <div style="height: 48px; padding-left: 5px">
                    <p>
                        语言：
                        <a-select v-model="question.language" style="width: 120px" defult-value="c">
                            <template v-for="item in question.language_allowed">
                                <a-select-option :key="item" :value="item">
                                    {{ item }}
                                </a-select-option>
                            </template>
                        </a-select>
                        <span style="color: #999999; margin-left: 15px;">*可以通过拖拽文件/文本的方式来快速填写代码</span>
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
        backMethod: String,
    },  // 从父组件获得题目ID，然后在接口里获得全部值
    data() {
        return {
            jump: 0,   // 跳转的次数，用于返回
            aimID: 1000,
            ID: 1000,  // 题目的ID
            leftInner: ["question"],  // 左边显示的内容
            comment: "",   // 编辑框内容
            commentReply: "",  // 回复框内容
            commentPost: 0,   // 回复对象的RID
            commentPage: 1,  // 整个回复的页码
            commentSize: 10, // 每一页展示的内容数量
            leftW: 500,   // 左边宽度
            rightW: 500,   // 右边宽度
            loading: false, // 加载状态
            commentLoading: false, // 评论区的加载状态
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
            commentReplyNum: [0,0],  // 当前打开的是哪个输入框，第一个数字代表一级评论，第二个数字代表二级
            commentContext: [],
        }
    },
    methods: {
        back() {  //返回上一页的方法
            // this.$emit("back");
            this.$router.go(-1 * (this.jump + 1));
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
            let url = '/api/problem/' + this.ID;
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
            
        },
        openComment() {  // 加载评论
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
                        info["page"] = 1;             // 评论页码
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
                this.openComment();
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
                    that.openComment();   // 重新加载评论
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
        routeTo(id) { // 修改route
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
    },
    watch: {
        $route(to) {
            // 修改ID
            this.ID = to.params.ID;
            // 修改aimID
            this.aimID = to.params.ID;
            // 重置代码
            this.question.code = "";
            // 重置评论
            this.commentContext = [];
            // 页面切换到问题
            this.leftInner = ["question"];
            // 跳转一次
            this.jump++;
            // 打开问题
            this.openQuestion();
        }
    },
    mounted() {
        let that = this;
        // 设置宽度
        that.rightW = window.innerWidth - 20 - that.leftW;
        window.onresize = function() {
            that.rightW = window.innerWidth - 20 - that.leftW;
        }
        // 获取id
        that.ID = this.$route.params.ID;
        that.aimID = this.$route.params.ID;
        // 刚打开页面时，加载一次问题
        that.openQuestion();
    },
    
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
    min-width: 400px;
}
.question .leftContainer {
    /* 48是menu,64是buttons */
    height: calc(100% - 48px - 64px);
    /* overflow: auto; */
    overflow-y: scroll;
    padding: 0 10px;
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
    min-width: 400px;
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
    user-select: none;
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
    padding: 0 5px;
}
.question .buttons > input {
    width: 120px;
}
.CodeMirror {
    height: 100% !important;
}
</style>