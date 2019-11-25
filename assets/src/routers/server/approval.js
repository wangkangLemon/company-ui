const pathPre = 'approval'
export default {
    path: pathPre,
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/views/server/approval/Index.vue'))
        })
    },
}
