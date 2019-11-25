// 题库管理
const pathPre = 'library'
export default {
    path: pathPre,
    name: 'test-library-index',
    component: resolve => {
        require.ensure([], () => {
            resolve(require('../../views/exam/library/Index.vue'))
        })
    },
    meta: {
        title: '题库管理',
        noback: true
    }
}
