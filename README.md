# 湘潭大学OJ系统

## 前言

- 关于底层逻辑：湘潭大学OJ系统是基于vue2.0的vue-cli脚手架应用。应用所需要用到的功能会尽量包装为组件，保证在需要复用的时候能够更为方便的复用。
- 关于变量名：该应用的数据变量名、方法名等于JS有关的变量名全部采用小驼峰命名（如handleSearch、handleReset），类名、ID等与CSS有关的变量名采用短横线分隔式命名（如inline-element）。
- 关于合作和维护：该应用代码会在github开源，链接为https://github.com/ST-AR15/XTUOJ。

## 使用组件/框架

1. vue

   vue应用的核心。

2. vue-router

   为vue提供路由管理器，它可以实现在导航栏更换router来切换页面。

3. vuex

   vue仓库，可以存储vue的状态数据

4. ant-design-vue

   一个组件库，可以快捷、高效、实用性强地开发应用

5. mavon-editor

   一个富文本编辑器，可以实现markdown文档输入、html文档输入和mathjax输入

6. vue-codemirror

   一个代码编辑器，可以实现代码高亮

7. axios

   一个用于调用接口API的库，可以用它方便地调用API并获得调用结果。

## 文件结构

结合vue项目的基本文件结构以及我们当前项目的实际情况，该项目的文件结构大致如下：

```python
├── package.json    # 模块描述文件
├── vue.config.js   # 项目配置
├── public
│   ├── lib         # 网页静态资源
│   │   └── ...     # 字体等静态资源
│   ├── favicon.ico # 网页图标
│   └── index.html  # 入口 html 文件
└── src
    ├── main.js     # 全局 js 配置
    ├── App.vue     # 入口vue文件
    ├── view        # 所有视图（页面）
    ├── utils       # 脚本文件(js)
    ├── styles      # 样式文件(css)
    ├── store       # vuex仓库（状态存储）
    └── router      # 路由文件（配置路由的js）
```

## 说明书

### user

#### App.vue

user页面的入口文件，使用了antd的a-layout布局（header和content）所有user页面都是在这个页面里进行切换的。

```javascript
// 变量解释
/**
 * 代表页面展示的内容，主要用于配合顶部的菜单，保证不管是 
 * 切换路由还是点击菜单进行切换都能正确地展示菜单
 * @property { Array } page
 */
		page: ['home'],
/**
 * login界面的展示状态
 * @property { Boolean } loginVisible
 */
        loginVisible： false,

// 方法解释
/**
 * 组件内（user内）页面切换
 * @method queryPage
 * @param { String } page 切换的目的路由
 */
	queryPage(page) { …… }
/**
 * 前往admin页
 * @method queryPerson
 */
	queryPerson() { …… }
/**
 * 登录的回调函数
 * @method login
 */
	login() { …… }
/**
 * 登出的回调函数
 * @method logout
 */
	logout() { …… }
```

#### Home.vue

展示通知的首页，使用了a-layout，有一个header，一个sider和一个content。header是标题，sider是时间进度栏，content是通知内容。

```javascript
// 变量解释
/**
 * 左边时间进度栏的内容
 * @property { Array } timer
 */
		timer: [……],
/**
 * 右边通知内容
 * @property { Array } announcements
 */
		announcements: [……],
```

#### Problems.vue

使用了自己写的组件questionlist

```javascript
// 变量解释
/**
 * 传给questionlist组件的，题目列表后面能使用的方法
 * @property { Array } buttons
 */
		buttons: [……],

// 方法解释
/**
 * 题目切换的回调函数
 * @method queryQuestion
 * @param { Object } param questionlist组件传来的题目详情
 */
	queryQuestion(param) { …… }
```

#### Question.vue

展示问题的页面，由一个header和一个container组成，container内又由left、bar和right组成。拖动bar可以调节left和right的宽度。其中left里是题目描述，right里是输入代码的编辑框。

另外，左边的题目展示使用的是mavonEditor渲染markdown格式，右边的编辑器使用的是codemirror。

```javascript
// 变量解释
// 由于变量过多，不每个都详解
jump: 0,                  // 跳转的次数，用于返回
aimID: 1000,              // 与底部跳转绑定的数值
ID: 1000,                 // 题目的ID
leftInner: ["question"],  // 左边显示的内容
comment: "",              // 编辑框内容
commentReply: "",         // 回复框内容
commentPost: 0,           // 回复对象的RID
commentPage: 1,           // 整个回复的页码
commentSize: 10,          // 每一页展示的内容数量
leftW: 500,               // 左边宽度
rightW: 500,              // 右边宽度
loading: false,           // 题目加载状态
commentLoading: false,    // 评论区的加载状态
commentReplyNum: [0,0],   // 当前打开的是哪个输入框，第一个数字代表一级评论，第二个数字代表二级
commentContext: [],       // 评论区内容
cmOptions: {……},          // codemirror设置
question: {},             // 题目信息

// 方法解释
// 同上，方法过多，不每个都详解
back() { …… }              // 点击返回时的回调函数
handleFile(file) { …… }    // 上传代码文件并誊写到代码框
querySubmit() { …… }       // 提交代码
queryQuestion() { …… }     // 加载问题
dragBar(e) { …… }          // 拖拽中间的bar时的回调
queryComment() { …… }      // 加载评论
deleteComment(Rid) { …… }  // 删除评论，Rid是评论的id
sendComment(reply) { …… }  // 上传评论
openTextarea(a, b, post){} // 打开评论框，ab是用于判断几级评论下的第几个，post是回复对象的RID
handleRoute(id) { …… }     // 跳转到目标id的题目
handleTab(aim) { …… }      // 板块切换时的回调
```

#### Contest.vue

展示比赛的页面。由比赛列表和题目列表组成。

```javascript
// 变量解释
/**
 * 当前展示的列表，有contests（竞赛列表）和questionlist（题目列表）两种
 * @property { String } pageNow
 */
		pageNow: "contests",
/**
 * 列表的表设置
 * @property { Array } pagination
 */
		pagination: [……],
/**
 * 列表的表头设置
 * @property { Array } columns
 */
		columns: [……],
/**
 * 竞赛列表内容
 * @property { Array } contests
 */
		contests: [……],

// 方法解释
/**
 * 查看某比赛信息
 * @method queryContest 
 * @param { Number } contestID 目标比赛的ID
 */
	queryContest(contestsID) { …… }
/**
 * 题目切换的回调函数
 * @method queryQuestionlist
 */
	queryRegister() { …… }
```

#### Status.vue

展示提交状态的页面，使用了一个表格。

```javascript
// 变量解释
/**
 * 表格设置
 * @property { Object } pagination
 */
		pagination: { …… },
/**
 * 表头设置
 * @property { Array } columns
 */
		columns: [ …… ],
/**
 * 内容设置
 * @property { Array } status
 */
		status: { …… },
```

### admin

#### App.vue

admin页面的入口文件，使用了antd的a-layout布局（header是标题，sider是菜单，content是内容，footer是底下的内容），所有admin页面都是在这个页面里进行切换的。

```javascript
// 变量解释
/**
 * 代表页面展示的内容，主要用于配合左侧的菜单，保证不管是 
 * 切换路由还是点击菜单进行切换都能正确地展示菜单
 * @property { Array } page
 */
		page: ['home'],
// 方法解释
/**
 * 回到用户页面
 * @method back
 */
	back() { …… }
/**
 * 打开某页
 * @method handlePage
 * @param { String } type 页面前半段
 * @param { String } page 页面后半段
 */
	handlePage(type, page) { …… }
```

#### question-Add.vue

添加问题，使用了mavonEditor来编写markdown文档

```javascript
// 变量解释
/**
 * mavonEditor的设置
 * @property { Object } editorOption
 */
		editorOption: { …… },
/**
 * 表单的排版设置
 * @property { Object } labelCol
 * @property { Object } wrapperCol
 */
        labelCol: { …… },
		wrapperCol: { …… },
/**
 * 表单的默认数据
 * @property { Object } formDefult
 * 表单数据
 * @property { Object } form
 * 表单的填写规则
 * @property { Object } rules
 */
		formDefult: { …… },
		form: { …… },
        rules: { …… },
/**
 * 弹窗设置
 * @property { Object } modal
 */
		modal: { …… },

// 方法解释
/**
 * 提交表单
 * @method queryForm
 */
	queryForm() { …… }       
/**
 * 重置表单
 * @method resetForm
 */
	resetForm() { …… }     
```

#### question-Manage.vue

使用了自己的组件questionlist，另外使用了mavonEditor来实现题目内容的编辑。该页面仅实现了功能，变量设置仍需要优化，因此不进行介绍。

#### contest-Add.vue

创建比赛。有新建和克隆两种方式。

```javascript
// 变量解释
/**
 * 创建比赛的模式，有new（新建比赛）和clone（克隆比赛）两种
 * @property { String } createMode
 */
		createMode: "new",
/**
 * 支持的编译器
 * @property { Array } compilerList
 */
		compilerList: [ …… ],
/**
 * 表单的排版设置
 * @property { Object } labelCol
 * @property { Object } wrapperCol
 */
        labelCol: { …… },
		wrapperCol: { …… },
/**
 * 表单数据
 * @property { Object } form
 * 表单的填写规则
 * @property { Object } rules
 */``
		form: { …… },
        rules: { …… },

// 方法解释
/**
 * 添加或者删除某个题目
 * @method handleQuestion
 * @param { Number } i 题目位于题目列表第几个
 */
	handleQuestion(i) { …… }       
/**
 * 获取题目标题，在添加题目的时候触发
 * @method queryTitle
 * @param { Number } i 题目ID
 */
	queryTitle(i) { …… }   
```

#### contest-Manage.vue

管理比赛，使用了mavonEditor作为富文本编辑框

```javascript
// 变量解释
/**
 * 表格页面设置
 * @property { Object } pagination
 * 表格内容
 * @property { Array } contests
 * 表格表头
 * @property { Array } columns
 */
		pagination: [ …… ],
		contests: { …… },
		columns: { …… },
/**
 * 题目管理的对话框设置
 * @property { Object } questionModal
 * 发送通知的对话框设置
 * @property { Object } noticeModal
 */
		questionModal: { …… },
		noticeModal: { …… },

// 方法解释
/**
 * 管理比赛名单
 * @method queryNamelist
 * @param { Number } contestID 比赛ID
 */
	queryNamelist(contestID) { …… }   
/**
 * 管理题目
 * @method queryQuestion
 * @param { Number } contestID 比赛ID
 */
	queryQuestion(contestID) { …… }   
/**
 * 发送通知
 * @method queryNotice
 * @param { Number } contestID 比赛ID
 */
	queryNotice(contestID) { …… }   
/**
 * 管理比赛的题目
 * @method handelQuestion
 * @param { Number } i 题目位于题目列表第几个
 */
	handleQuestion(i) { …… } 

```

#### user-Me.vue

自己数据管理的页面，现在只有一个登出

#### uesr-Search.vue

搜素某用户

### outer

 outer里面的内容预计是不和OJ系统挂钩的，用于公示一类的页面。现在只有一个rank。

#### Rank.vue

页面从上往下分别是：

- h1 标题
- time 时间轴
- tip 顶上的颜色提示
- filter 过滤关注的队伍
- list 排行表格内容 分表头、关注栏、总栏和统计栏
- balloon 气球表格内容

```javascript
// 变量解释
// 由于不是最终优化结果，所以不每个都详解
page: "ranklist",            // 当前页面
title: "",                   // 比赛名称
time: {},                    // 时间刻度
stamp: {                     // 比赛开始和结束的时间戳
    start: Number,
    end: Number,
},
timeStep: 1000,               // 进度条最低刻度
progress: Number,             // 进度条当前时间的时间戳
list：[
    question: Number,         // 题目数量
    score: [],                // 排名详情  
    star: [],                 // 关注的队伍的详情
    questionInfo: {},         // 底下的统计
    placeChange: [],          // 变化点
],
school: [],                   // 参加比赛的组织集合，用于筛选时选择
starSchool: [],               // 关注的队伍
query: {},                    // 网址栏上的query
balloon: [],                  // 气球栏内容
columns: [],                  // 气球栏表格设置
pagination: {},               // 气球栏表格分页设置
timer: "",                    // 计时器，让时间一直动
    
// 方法解释
init() { …… },                // 初始化
formatter() { …… },           // 格式化时间
msToTime(ms) { …… },          // 格式化时间
timeFormatter(a, b) { …… },   // 格式化时间
handleStar(value) { …… },     // 修改关注队伍时触发
handleTime() { …… },         // 拖动时间进度条的时候触发
handleQuery() { …… },         // 把数据放在地址栏的query里
```

### general

通用页面。目前只有404

#### 404.vue

出现404错误时展示的页面