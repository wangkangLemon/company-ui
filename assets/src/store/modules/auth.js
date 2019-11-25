import {
    INDEX_SETWEBPATH,
    AUTH_SET_OPERATION,
} from '../mutations'

const Auth = {
    state: {
        user: {},
        operations: {},
    },

    mutations: {
        [INDEX_SETWEBPATH] (state, user) {
            state.user = user
        },
        [AUTH_SET_OPERATION] (state, operations) {
            operations.map(item => {
                state.operations[item] = true
            })
        },
    }
}

export default Auth
