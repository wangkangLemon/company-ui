const pathPre = '/teaching'
import template from './template'
import learn from './learn'
import statistics from './statistics'

export default {
    path: pathPre,
    name: pathPre.slice(1),
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/views/learning/teaching/Index.vue'))
        })
    },
    children: [
        ...template,
        ...learn,
        ...statistics
    ]
}
