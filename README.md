# 湘潭大学OJ系统

## 使用组件/框架

1. vue
2. vue-router
3. ant-design-vue

## 页面设计

### 页面逻辑

页面的router详见src/router/index.js

在打开应用的时候，进入的是App.vue（vue自带逻辑），然后通过App.vue的<router-view/>指向初始页面index.vue。在index.vue中有两个选项，一个是进入管理员端，另一个是进入用户端，他们分别指向admin/admin.vue和user/user.vue。



### admin.vue

使用了a-layout的第二种布局

