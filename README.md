# 湘潭大学OJ系统

## 使用组件/框架

1. vue
2. vue-router
3. ant-design-vue

## 页面设计

### 用户页面（user）

#### user.vue

user.vue是在router上声明了的。所以进入该页面只需要域名/user即可。所有用户有关的组件都在user页面展示。

##### 页面布局

user.vue使用了antd的a-layout布局。分为上面的header和下面的content。

上面的header使用了自定义的flex布局。详细写在`user.vue - line93`。header包含三个部分，左边的图标、中间的菜单、右边的登录。菜单使用了antd的组件a-menu。

下面的content包含了所有这个页面会使用到的组件。他们分别是：

```vue
@/user/home.vue
@/user/problems.vue
@/user/contents.vue
@/user/status.vue
@/user/ranklist.vue
@/user/question.vue
```

这些组件的出现由变量`page`控制。提供给用户修改这个变量的方法是点击对应的按钮（比如顶部的菜单、问题后面的详情等）。理论上一次性只能显示一个组件。

##### data

```javascript
/**
 * 长度为1的数组，page[0]是当前展示的模块名
 * @property {Array} page
 */
	page: ['home'],
/**
 * 传给question页面的问题ID（打开question页面时父子页面传值）
 * @property {number} ID
 */
	ID: 0,
/**
 * 传给question页面的page名，用于其他组件使用“返回上一页”功能的时候。它会在需要的时候传给跳转后的组件，然后在使用那个组件的“返回上一页”功能时通过这个值确认它的上一页是什么（目前用于question页，在home页打开question时的返回就是到home，从contests页打开quesition时返回的就是contests）
 * @property { String } pagePre
 */
	pagePre: "",
```

##### methods

```javascript
/**
 * 打开问题时调用的方法。传入问题ID，然后切换为question组件。
 * @method goQuestion
 * @param {number} ID 传给问题页面的，打开的问题的ID
 */
	goQuestion(ID) { …… }
/**
 * 打开某页时调用的方法。传入page，然后切换组件
 * @method openPage
 * @param {string} page 切换的组件名字对应的字符串
 */
    openPage(page) { …… }
```

#### home.vue

home.vue是用户端的首页组件。默认情况下打开user.vue第一个显示的组件就是home.vue。

##### 页面布局

页面里只有一个表格。表格使用了antd的组件a-table。绑定的表格属性是`columns`，绑定的数据是`questions`，绑定的分页器属性是`pagination`。

表格的居中是在a-table中设置margin的结果。字体大小、字间距的设置在`home.vue - line348`。标题padding的设置在`home.vue - line352`，标签颜色设置在`components/tips`，其他对表格自定义样式修改的属性在`components/antd.css`。



##### data

```javascript
/**
 * 用于配合搜索功能的字符串
 * @property { String } searchText
 */
	searchText: "",
/**
 * a-table表格分页器的设置。详情可见https://www.antdv.com/components/pagination-cn/
 * @property { object } pagination
 */
	pagination: {
        pageSize: 10,
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
 * 打开题目功能。传入题目ID，然后切换到question组件，展示对应题目
 * @method goQuestion
 * @param { number } 需要跳转的题目ID
 */
	goQuestion(ID) { …… }
```







