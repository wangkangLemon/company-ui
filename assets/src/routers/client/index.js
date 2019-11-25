const pathPre = '/client'

export default {
    path: pathPre,
    name: 'client-mobile',
    component: resolve => {
        require.ensure([], () => {
            resolve(require('@/views/client/Index.vue'))
        })
    },
    meta: {
        title: '手机客户端',
        noback: true
    }
}
