import {
    SIDEBAR_SET_ACTIVE
} from '../mutations'

const Sidebar = {
    state: {
        isActive: false
    },

    mutations: {
        [SIDEBAR_SET_ACTIVE] (state, isActive) {
            state.isActive = isActive
        }
    }
}

export default Sidebar
