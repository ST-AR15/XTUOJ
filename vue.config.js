const path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports={
    publicPath:"./", //用法和webpack本身的output.publickPath用法一致
    // configureWebpack: {
    //     plugins: [
    //         new CopyWebpackPlugin({
    //             patterns: [
    //                 {
    //                     from: 'node_modules/mavon-editor/dist/highlightjs',
    //                     to: path.resolve(__dirname, '../dist/highlightjs'), // 插件将会把文件导出于/dist/highlightjs之下
    //                 },
    //                 {
    //                     from: 'node_modules/mavon-editor/dist/markdown',
    //                     to: path.resolve(__dirname, '../dist/markdown'), // 插件将会把文件导出于/dist/markdown之下
    //                 },
    //                 {
    //                     from: 'node_modules/mavon-editor/dist/katex', // 插件将会把文件导出于/dist/katex之下
    //                     to: path.resolve(__dirname, '../dist/katex')
    //                 }
    //             ]
    //         })
    //     ],
    // }
}