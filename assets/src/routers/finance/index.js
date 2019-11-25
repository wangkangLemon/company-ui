const pathPre = '/finance'
import info from './info'
import log from './log'

export default {
    path: pathPre,
    name: 'finance',
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/views/finance/Index.vue'))
        })
    },
    children: [
        ...info,
        ...log
    ]
}
