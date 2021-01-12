//@auther ST-AR15 focks on github https://www.github.com/ST-AR15

/**
 * 把p中的可枚举属性复制到o中，并返回o
 * 如果o和p中含有同名属性，则覆盖o中的属性
 * 这个函数并不处理getter和setter以及复制属性
 */
export function extend(o, p) {
    for(prop in p) {           // 遍历p中的所有属性
        o[prop] = p[prop];     // 将属性添加至o中
    }
    return o;
}

/**
 * 将p中的可枚举属性复制至o中，并返回o
 * 如果o和p中有同名的属性，o中的属性将不受影响
 * 这个函数并不处理getter和setter以及复制属性
 */
export function merge(o, p) {
    for(prop in p) {                            // 遍历p中所有属性
        if(!o[prop]) o[prop] = p[prop];
    }
    return o;
}

/**
 * 如果o中的属性在p中没有同名属性，则从o中删除这个属性
 * 返回o
 */
export function restrict(o, p) {
    for(prop in o) {              // 遍历o中的所有属性
        if(!(prop in p)) {
            delete o[prop];       // 如果在p中不存在，则删除之
        }
        return o;
    }
}

/**
 * 如果o中的属性在p中存在同名属性，则从o中删除这个属性
 * 返回o
 */
export function subtract(o, p) {
    for(prop in p) {       // 遍历p中的所有属性
        delete o[prop];    // 从o中删除（删除不存在的属性不会报错）
    }
    return o;
}

/**
 * 返回一个新对象，这个对象同时拥有o的属性和p的属性
 * 如果o和p有重名属性，使用p的属性值
 */
export function union(o, p) {
    return extend(extend({}, o), p);
}

/**
 * 返回一个新对象，这个对象拥有同时在o和p中出现的属性
 * 很像o和p的交集，但是p中的属性被忽略
 */
export function intersection(o, p) {
    return restrict(extend({}, o), p);
}

/**
 * 返回一个数组，这个数组包含的是o中可枚举的自有属性的名字
 */
export function keys(o) {
    if(typeof o !== "object") throw TypeError();   // 参数必须是对象
    var result = [];                               // 将要返回的数组
    for(var prop in o) {                           // 遍历所有可枚举的属性
        if(o.hasOwnProperty(prop)) {               // 判断是否是自有属性
            result.push(prop);                     // 将属性名添加至数组中
        }
    }
    return result;                                 // 返回这个数组
}