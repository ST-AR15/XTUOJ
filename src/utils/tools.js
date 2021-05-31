//@auther ST-AR15 focks on github https://www.github.com/ST-AR15
import { message } from 'ant-design-vue'
/**
 * 模仿until.filterEmptyValue（大概）
 * 反正它的功能是：传入一个对象，然后删除掉里面空的值（undefined、null和NaN都去掉吧,''，null，undefined，[]，{}）
 */
export function filterEmptyValue(obj) {
    let newObj = {}
    // 如果不是object，就报错
    if (typeof obj !== 'object' || obj instanceof Array) {
        throw TypeError();
    } else {
        for(let attr in obj) {
            // 属性不为空
            if(obj[attr] !== '' && obj[attr] !== null && obj[attr] !== undefined) {
                // 内容不为空
                // 数组不能长度为0
                if(obj[attr] instanceof Array && obj[attr].length == 0) {
                    continue ;
                }
                // 对象不能没有内容
                if(obj[attr] instanceof Object) {
                    let i = 0;
                    for(i in obj[attr]) {
                        i++;
                    }
                    if(i == 0) {
                        continue ;
                    }
                }
                // 赋值给newObj
                newObj[attr] = obj[attr];
            }
        }
    }
    return newObj
}

/**
 * 把时间戳转换成xx:xx:xx或xxxx-xx-xx xx:xx:xx的格式
 * @param {number} flag 时间戳
 * @param {boolean} ifFull 是否同时输出年份
 */
export function timeFormatter(flag, isFull = false) {
    let time = new Date(parseInt(flag));
    if(isFull) {
        return `${ time.getFullYear() }-${ (time.getMonth()+1) }-${ time.getDate() } ${ time.getHours() }:${ time.getMinutes()<10? '0'+time.getMinutes():time.getMinutes() }:${ time.getSeconds()<10? '0'+time.getSeconds():time.getSeconds() }`
    } else {
        return `${ time.getHours() }:${ time.getMinutes() }:${ time.getSeconds()<10? '0'+time.getSeconds():time.getSeconds() }`
    }
}

/**
 * 把毫秒数转换成时分秒
 * @param {number} ms 毫秒数
 */
export function msToTime(ms) {
    let s = parseInt(ms / 1000 % 60);
    let min = parseInt(ms / 1000 / 60) % 60;
    let h = parseInt((ms - s*1000 - min*60*1000) / 1000 / 60 / 60);
    return `${h}:${min<10? '0'+min:min}:${s<10? '0'+s:s}`;

}

/**
 * 复制内容
 * @param { String } text 需要复制的内容
 */
export function copy(text) {
    let textarea = document.createElement('textarea');
    textarea.setAttribute('readonly', 'readonly');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    textarea.setSelectionRange(0, 9999);
    try {
        document.execCommand('Copy');
        message.success('复制成功');
    } catch (e) {
        message.error('复制失败');
    } finally {
        document.body.removeChild(textarea);
    }
    
}

/**
 * 获取浏览器缩放比例
 */
export function detectZoom() { 
    let ratio = 0,
        screen = window.screen,
        ua = navigator.userAgent.toLowerCase();
    if (window.devicePixelRatio !== undefined) {
        ratio = window.devicePixelRatio;
    }else if (~ua.indexOf('msie')) {  
        if (screen.deviceXDPI && screen.logicalXDPI) {
            ratio = screen.deviceXDPI / screen.logicalXDPI;
        }
    }else if (window.outerWidth !== undefined && window.innerWidth !== undefined) {
        ratio = window.outerWidth / window.innerWidth;
    }
    if (ratio){
        ratio = Math.round(ratio * 100);
    }
    return ratio;
}

/**
 * 对比数组和一个二进制数来返回新的数组
 * @param {Array} full 目标数组
 * @param {Number} num 二进制数
 */
 export function binaryToArray(full, num) {
    let arr = num.toString().split('');
    let newArr = [];
    for(let i in arr) {
        if(arr[i] == '1') {
            newArr.push(full[i]);
        }
    }
    return newArr;
} 

/**
 * 数组中插入数组
 * @param { Array } arrfirst 原数组
 * @param { Array } arrlast 插入的数组
 * @param { Number } index 插入的位置（从0开始）
 * @returns Array
 */
export function insertArray(arrfirst,arrlast,index){    //将数组arrlast插入数组arrfirst中，index是想要插入的位置
    if (index < 0){
        index = 0;
    }else if(index > arrfirst.length){
        index = arrfirst.length;
    }
    let arr = [];
    for (let i = 0; i < index; i++){
        arr.push(arrfirst[i]);
    }
    for (let i = 0; i < arrlast.length; i++){
        arr.push(arrlast[i]);
    }
    for (let i = index; i < arrfirst.length; i++){
        arr.push(arrfirst[i]);
    }
    return arr;
}

export function fontColor(bgColor) {
    const _r = 0.299;
    const _g = 0.587;
    const _b = 0.114;
    let r = (parseInt(bgColor.slice(1,3), 16)*_r);
    let g = (parseInt(bgColor.slice(3,5), 16)*_g);
    let b = (parseInt(bgColor.slice(5,7), 16)*_b);
    let color = (r+g+b)/255;
    if(color > 0.5) {
        return '#000000'
    } else {
        return '#FFFFFF'
    }
}