const pathPre = '/learning/maps'
import info from './info'
import complete from './complete'

export default {
    path: pathPre,
    name: 'learning',
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/views/learning/maps/Index.vue'))
        })
    },
    children: [
        ...info,
        ...complete
    ]
}
