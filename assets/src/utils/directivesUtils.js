/**
 * User: Pavle Lee <523260513@qq.com>
 * Date: 2017/11/10
 * Time: 下午5:27
 * Update: kangcc <kangcc@vodjk.com>
 * Time: 2017/12/21
 */
import Vue from 'vue'
import authUtils from 'utils/authUtils'

export const numberOnly = Vue.directive('numberOnly', {
    bind: function (el) {
        el.addEventListener('keyup', () => {
            let input = el.querySelector('.el-input__inner')
            input.value = input.value.replace(/[^.\d+]/, '')
        })
        el.addEventListener('click', () => {
            let input = el.querySelector('.el-input__inner')
            input.value = input.value.replace(/[^.\d+]/, '')
        })
    },
    unbind: function (el) {
        el.removeEventListener('keyup', () => {
            let input = el.querySelector('.el-input__inner')
            input.value = input.value.replace(/\D+/, '')
        })
        el.removeEventListener('click', () => {
            let input = el.querySelector('.el-input__inner')
            input.value = input.value.replace(/\D+/, '')
        })
    }
})

/**
 * 正整数过滤器
 * @type {[type]}
 */
const listenFn = () => {}
export const number = Vue.directive('number', {
    bind: (el, binding, vode, oldVnode) => {
        el.addEventListener('keyup', listenFn)
    },
    unbind: (el, binding, vnode, oldVnode) => {
        el.removeEventListener('keyup', listenFn)
    },
})

export const operation = Vue.directive('operation', {
    inserted: (el, binding) => {
        if (authUtils.getUserInfo().roles.indexOf(201) >= 0) {
            return
        }
        if (!binding.value) {
            el.remove()
        }
    }
})


// 门店数量正整数过滤
export const onlyNumber = Vue.directive('onlyNumber', {
    bind: function (el, binding, vnode) {
        el.addEventListener('keyup', () => {
            let input = el.querySelector('.el-input__inner')
            let value = input.value
            // debugger
            if(/^([1-9][0-9]*){1,3}$/.test(value)) {
                const newVal = value === '' ? undefined : Number(value)
                if (isNaN(newVal)) {
                    value.replace(/^([1-9][0-9]*){1,3}$/, (match, p1, p2, p3) => {
                        if (p2 != undefined) {
                            input.value = p2
                        } else {
                            input.value = ''
                            // if(vnode.context.ruleForm){
                            //     vnode.context.ruleForm.number = 0
                            // }
                        }
                    })
                }
            }else {
                input.value = ''
                // if(vnode.context.ruleForm){
                //     vnode.context.ruleForm.number = 0
                // }
                    
            }
            
        })
    },
})

export const pnumberOnly = Vue.directive('pnumberOnly', {
    bind: function (el) {
        el.addEventListener('keyup', () => {
            let input = el.querySelector('.el-input__inner') || el
            let value = input.value
            // debugger
            input.value = isNaN(parseInt(value)) ? '' : parseInt(value)
            // input.value = newVal.replace(/[^.\d+]|(\d+\.)\.?$/, '$1')
        })
    },
    unbind: function (el) {
        el.removeEventListener('keyup', () => {
            let input = el.querySelector('.el-input__inner')
            let value = input.value
            input.value = isNaN(parseInt(value)) ? '' : parseInt(value)
        })
    }
})
