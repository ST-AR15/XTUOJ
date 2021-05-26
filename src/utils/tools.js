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
    var ratio = 0,
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
  