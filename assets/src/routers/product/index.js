const pathPre = '/product'
import manage from './manage'
import statistics from './statistics'

export default {
    path: pathPre,
    name: 'learning',
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/views/product/Index.vue'))
        })
    },
    children: [
        ...manage,
        ...statistics
    ]
}
