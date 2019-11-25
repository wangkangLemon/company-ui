/**
 * Created by huangrui on 2017/7/4.
 */
/*
 * 获取数组ID所在项的index
 * 数组 array
 * ID  id
 */
export function getArrayIdIndex (array, id) {
    return array.findIndex((value, index, arr) => {
        return value.id == id
    })
}

/**
 * 判断两个数组的值是否相等
 * arrB [{name: xx, code: xx},...]
 */
export function isArrayEqual (arrA, arrB, formatter) {
    formatter && (arrB = formatter(arrB))
    return arrA.filter(x => !arrB.includes(x)).length
}

/**
 * 从数组对象中提取某个属性组成数组
 */
export function getArrayId (array, attr) {
    array = array || []
    return array.map(item => {
        return item[attr]
    })
}

/**
 * 判断数据类型
 */
export function typeOf (o) {
    return o == null ? String(o) : ({}).toString.call(o).slice(8, -1).toLowerCase()
}

/**
 * 深度克隆
 * @param  {Object} obj
 * @return {Object} newobj
 */
export function clone (obj) {
    let type = typeOf(obj)
    switch (type) {
    case 'object':
        var cloned = {}
        for (let i in obj) {
            cloned[i] = clone(obj[i])
        }
        return cloned
    case 'array':
        return obj.map(clone)
    default:
        return obj
    }
}

export function obj2Arr (obj) {
    let res = []
    res.push(obj)
    return res
}

// 输入框中的字符统一处理
export function encodeParam (val) {
    return window.encodeURIComponent(val)
}
/**
 * 覆盖target中已有的变量，没有的变量不赋值
 */
export function objectMerge (target, ...sources) {
    for (let source of sources) {
        Object.keys(source).forEach(item => {
            if (item in target) {
                target[item] = source[item] || target[item]
            }
        })
    }
}

export function validatePositiveNum (num) {
    let reg = /^[1-9]\d*$/g
    return reg.test(num)
}

// 乘法float 保留num位小数
export function foatMul(arg1,arg2,num){
    var m=0,s1=arg1.toString(),s2=arg2.toString();
    try{m+=s1.split(".")[1].length}catch(e){}
    try{m+=s2.split(".")[1].length}catch(e){}
    return (Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m)).toFixed(num);
}

export class BitMap {
    constructor (n) {
        this.data = []
    }
    getIdx (num) {
        return parseInt(num / 32)
    }
    getPos (num) {
        return num % 32
    }
    add (num) {
        const index = this.getIdx(num)
        const pos = this.getPos(num)
        if (this.data[index] === undefined) {
            this.data[index] = 0
        }
        this.data[index] |= Math.pow(2, pos)
    }
    exist (num) {
        const index = this.getIdx(num)
        const pos = this.getPos(num)
        return !!(this.data[index] && (this.data[index] & Math.pow(2, pos)))
    }
}
