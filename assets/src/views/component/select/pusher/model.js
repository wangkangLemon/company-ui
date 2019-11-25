export default class Pusher {
    /**
     * get pusher list by key
     * @param  {Array} keys 关键字数组，获得指定list
     * @return {Array}
     */
    constructor () {
        this.transferList = {
            organization: {
                type: 'organization',
                label: '选择部门',
                label2: '选择部门/门店',
                component: 'CompanyTreeTransfer',
                isSearch: true,
                defaultCheckeds: [],
                defaultExpandedKeys: [],
            },
            department: {
                type: 'department',
                label: '选择门店',
                component: 'DepartmentTranfer',
                isSearch: false,
                selected: [],
            },
            user: {
                type: 'user',
                label: '选择人员',
                component: 'UserTransfer',
                isSearch: true,
                selected: [],
            },
            user_group: {
                type: 'user_group',
                label: '选择用户组',
                component: 'UserGroupTransfer',
                isSearch: false,
                selected: [],
            }
        }
        this.pusherList = [
            {
                label: '全体员工',
                value: 'company',
            },
            {
                label: '指定部门',
                value: 'organization',
            },
            {
                label: '指定门店',
                value: 'department',
            },
            {
                label: '指定用户组',
                value: 'user_group',
            },
            {
                label: '指定员工',
                value: 'user',
            }
        ]
    }
    getPusherList (keys) {
        return this.pusherList.filter(item => keys.includes(item.value))
    }
    getPusherTransfer (keys, exclude) {
        let res = {}
        keys.forEach(key => {
            if (key !== exclude) {
                res[key] = this.transferList[key]
            }
        })
        return res
    }
    initSelected (key, data = []) {
        if (key === 'company') return
        this.transferList[key].selected = data
    }
    getList (keys = Pusher.keys, exclude = 'company') {
        let pusherList = this.getPusherList(keys)
        let pusherTransfer = this.getPusherTransfer(keys, exclude)
        // debugger
        return {
            pusherList,
            pusherTransfer
        }
    }
}
Pusher.keys = ['company', 'organization', 'department', 'user_group', 'user']
