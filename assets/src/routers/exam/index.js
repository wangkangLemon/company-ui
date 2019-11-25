import examPaper from './paper' // 试卷管理
import examLibrary from './library' // 题库管理
import examQuestion from './question' // 试题管理
import examPractice from './practice' // 练习管理
const pathPre = '/exam'

export default {
    path: pathPre,
    name: 'exam',
    component: resolve => {
        require.ensure([], () => {
            resolve(require('../../views/exam/Index.vue'))
        })
    },
    children: [
        ...examPaper,
        examLibrary,
        examQuestion,
        ...examPractice
    ]
}
