// 试题管理
const pathPre = 'question'
export default {
    path: `${pathPre}`,
    name: 'test-question-index',
    component: resolve => {
        require.ensure([], () => {
            resolve(require('../../views/exam/question/Index.vue'))
        })
    },
    meta: {
        title: '试题管理',
        noback: true
    }
}
