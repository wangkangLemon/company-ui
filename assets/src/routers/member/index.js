import customer from './customer'
import flowing from './flowing'
import selling from './selling'
import task from './task'
export default {
    path: '/member',
    name: 'member',
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/views/member/Index.vue'))
        })
    },
    children: [
        customer,
        flowing,
        selling,
        task,
    ]
}
