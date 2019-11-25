import email from './email'
import exports from './export'
import report from './report'
import gsp from './gsp'

const pathPre = '/analysis'

export default {
    path: pathPre,
    name: 'analysis',
    component: resolve => {
        require.ensure([], () => {
            resolve(require('../../views/analytics/Index.vue'))
        })
    },
    children: [
        email,
        exports,
        report,
        ...gsp,
    ]
}
