//@auther ST-AR15 focks on github https://www.github.com/ST-AR15

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
        return `${time.getFullYear()}-${(time.getMonth()+1)<10? '0'+(time.getMonth()+1) : (time.getMonth()+1)}-${time.getDate()} ${time.getHours()}:${time.getMinutes()<10? '0'+time.getMinutes():time.getMinutes()}:${time.getSeconds()<10? '0'+time.getSeconds():time.getSeconds()}`
    } else {
        return `${time.getHours()}:${time.getMinutes()<10? '0'+time.getMinutes():time.getMinutes()}:${time.getSeconds()<10? '0'+time.getSeconds():time.getSeconds()}`
    }
}