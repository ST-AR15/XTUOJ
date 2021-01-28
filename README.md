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

3. ant-design-vue

   一个组件库，可以快捷、高效、实用性强地开发应用

4. mavon-editor

   一个富文本编辑器，可以实现markdown文档输入、html文档输入和mathjax输入
   
5. vue-codemirror

   一个代码编辑器，可以实现代码高亮

6. axios

   一个用于调用接口API的库，可以用它方便地调用API并获得调用结果。

## 页面设计

### user

user页面的设计如下：

```html
<div class="user">
    <a-layout>
        <a-layout-header>
            <div class=logo></div>
            <a-menu></a-menu>
            <div class="button"></div>
        </a-layout-header>
        <a-layout-content>
            <div class="container">
                <div class="page"></div>
                <div class="footer"></div>
            </div>
        </a-layout-content>
    </a-layout>
</div>
```



## 组件设计

### 通用组件（components）

#### questionlist.vue

##### 组件作用

questionlist.vue是一个用于展示题目列表的组件，作用是展示一个题目的列表。它有固定的表头和表格格式，但根据传入值的不同会有不同的交互按钮和题目。

在使用这个组件的时候，要传入一个数组buttons作为表格后面的交互按钮，并注册所有需要用到的方法。

##### 组件布局

页面里只有一个表格。表格使用了antd的组件a-table。绑定的表格属性是`columns`，绑定的数据是`questions`，绑定的分页器属性是`pagination`。

表格的居中是在a-table中设置margin的结果。字体大小、字间距的设置在`questionlist.vue - line293`。标题padding的设置在`questionlist.vue - line297`，标签颜色设置在`components/tips`，其他对表格自定义样式修改的属性在`components/antd.css`。

##### props

```javascript
/**
 * 存储交互方式的数组，数组里每一项都是一个交互（放在表格最后面“操作”一栏里）。text是写在按钮上的内容，method是调用的父函数的方法。正因如此，在使用这个组件的时候要监听这些调用。
 * @property {Array} buttons
 */
	buttons: [
        {
            text: "",
            method: ""
        },
        ……
    ]
```

##### data

```javascript
/**
 * 用于配合搜索功能的字符串
 * @property { String } searchText
 */
	searchText: "",
/**
 * 用于实现表格的加载。当这个值为true的时候，表格会进入加载状态。反之退出
 * @property { Boolean } loading
 */
	loading: false,
/**
 * a-table表格分页器的设置。详情可见https://www.antdv.com/components/pagination-cn/
 * @property { object } pagination
 */
	pagination: {
        pageSize: 10,
        showQuickJump: true,
        total: 0,
    },
/**
 * a-table表格的表头设置
 * @property { Array } columns
 */
	columns: [ …… ],
/**
 * 问题列表。每个问题都是这个数组的一项且都是object。这些object的有效键名分别为ID（题目ID）、title（题目标题）、tips（题目标签，是一个数组）、status（提交状态）、source（题目来源）、accept（通过人数）、total（做题人数）。
 * @property { Array } questions
 */
	questions: [ …… ]
```

##### methods

```javascript
/**
 * 表格里的搜索功能
 * @method handleSearch
 */
	handleSearch(selectedKeys, confirm, dataIndex) { …… }
/**
 * 表格里的清空功能
 * @method handleReset
 */
	handleReset(clearFilters) { …… }
/**
 * 表格切换页面的功能，可以在切换页面的时候调用API获取该页的内容
 * @method handleTableChange
 * @param { object } pagination 传入点击切换页面时的相关数据
 */
	handleReset(pagination) { …… }
/**
 * 调用父函数的功能
 * @method callbackMethod
 * @param { String } fatherMethod 调用的父函数的函数名
 * @param { Number } param 操作按钮对应题目的ID，交由父函数进行处理
 */
	callbackMethod(fatherMethod,param) {
    	this.$emit(fatherMethod, param);
    }
```

##### mounted

页面加载时，加载第一页的内容并确定总页数。

#### question.vue

##### 组件作用

question.vue组件用于展示某一道题目。在question.vue页面中，用户可以查看题目的详情内容或提交代码。另外，这个页面使用了codemirror作为代码编辑器，所以声明了有关它的内容。

在使用这个组件的时候，要传入一个数字ID作为题目的ID，另外，要注册一个back方法供该组件点击返回的时候调用。

##### 组件布局

这个页面使用了antd的a-layout布局。分为上面的header和下面的sider和content（sider在content左边）

上面的header只有一个a-page-header组件，用于返回上一页。

sider是放题目详情的地方。在sider里面，h1是题目的ID和大标题，h2是小标题，p是小标题下的正文。里面还使用了a-tag来显示这个题的标签。a-tag标签颜色的自定义在`components/tips.css`。另外，这里面的部分样式也有自定义的修改，可以在`question.vue - line128`看到。

content是放代码的地方。在content里面有三个部分，第一个部分是上面的div，这个div里放着有关代码编辑器的设置选项。目前只有一个选择语言的a-select。

##### props

``` javascript
/**
 * 需要展示题目的ID
 * @property { Number } ID
 */
	ID： Number,
/**
 * 点击返回按钮时触发的父函数
 * @property { String } backMethod
 */
	backMethod： String,
```

##### data
```javascript
/**
 * codemirror的配置
 * @property { Object } cmOptions
 */
	cmOptions: { …… }

/**
 * 有关这个问题的所有内容。具体每一项的作用写在了代码里。
 * @property { Object } question
 */
	question: {
        language: String,        // 当前使用的编译器
        language_allowed: Array, // 允许使用的编译器
        title: String,           // 题目标题
        tips: Array,             // 题目标签
        questionDetail: String,  // 题目内容。用markdown直接展示
        code: String,            // 用户输入的代码
        timeLimit: 128,          // 题目的时限
        memoryLimit: 128,        // 题目的存限
    }
```

##### methods

```javascript
/**
 * 点击返回时调用，触发传入的父函数
 * @method back
 */
	back() {
    	this.$emit("back");
    }
```

##### mounted

页面加载时，要根据传入的题目ID调用获取题目的详情。







