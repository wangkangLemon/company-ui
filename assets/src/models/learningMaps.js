// common model
// learning map's phase

import { clone, objectMerge } from 'utils/common'
import Task from 'components/dialog/task/model'

export default class Maps {
    constructor (options = {}) {
        this.title = ''
        this.image = ''
        this.type = ''            // 发布对象类型
        this.push_type_id = ''    // 发布对象id
        this.push_type_list = []
        this.phase_list = []
        this.departments = []
        this.parent_departments = []
        this.origin_length = 0
        this.total_phase = 0
        for (let [item, value] of Object.entries(options)) {
            this[item] = value
        }
        if (this.data) {
            this._format(this)
            this._createPhase(this.phase_list)
        } else {
            this.insert()
        }
    }
    _format (maps) {
        objectMerge(maps, maps.data)
    }
    _createPhase (array, defaultProps = {}) {
        array.forEach((item, index) => {
            // this._replace(Object.assign(defaultProps, item), index)  // defaultProps是公共变量,会导致最后一个覆盖前一个
            this._replace(item, index)
        })
    }
    _replace (phase = {}, index) {
        let _phase = new Phase({
            data: phase
        })
        _phase.phase_id = this.origin_length
        this.origin_length += 1
        this.phase_list.splice(index, 1, _phase)
    }
    insert (phase = {}, index, replace) {
        if (!phase) throw new Error('insertPhase error: phase is required.')
        if (!(phase instanceof Phase)) {
            phase = new Phase()
            var l = this.phase_list.length
            phase.phase = ++l
            phase.phase_id = this.origin_length
        }
        this.phase_list.push(phase)
        this.origin_length += 1
    }
    deletePhase (index) {
        this.phase_list.splice(index, 1)
        this._resetPhase()
    }
    _resetPhase () {
        this.phase_list.forEach((phase, index) => {
            phase.phase = index + 1
        })
    }
    // 传入发布对象要取的id
    save (push_id) {
        if (this.type !== 'company') {
            // push_type_list在请求接口的时候去掉了
            this.push_type_id = this.push_type_list.map(item => item[push_id]).join(',')
        }
        let res = clone(this)
        res.total_phase = res.phase_list.length
        res.phase_list.forEach(phase => {
            // 不添加选修时去掉elective_count
            if (phase.elective === 1) {
                phase.elective_count = 0
            }
            ['data', 'phase_id', 'requiredTaskSelected', 'unRequiredTaskSelected', 'examTaskSelected'].forEach(item => {
                delete phase[item]
            })
            phase.phase_object_list.forEach((task, index, array) => {
                if (phase.elective === 1) {
                    task.type == 2 && array.splice(index, 1)
                }
                ['data'].forEach(item => {
                    delete task[item]
                })
            })
        })
        return res
    }
}

class Phase {
    constructor (options = {}) {
        this.phase_id = 0
        this.id = 0
        this.phase = 1
        this.study_score = void 0 // 学分奖励
        this.sequence = 1   // 必修学习是否可排序；1-可，2-不可
        this.elective = 1   // 是否添加选修；1-否，2-是
        this.elective_count = 1 // 选修任务数，只有在有选修的情况下，该字段有值
        this.phase_object_list = []
        // this.requiredTaskSelected = []
        // this.unRequiredTaskSelected = []
        // this.examTaskSelected = []
        for (let [item, value] of Object.entries(options)) {
            this[item] = value
        }
        if (this.data) {
            this._format(this)
            this.phase_object_list = this.createPhaseTask(this.phase_object_list, true)
        }
    }
    _format (phase) {
        this._initTaskSelected(Phase.taskSelectedMap)
        objectMerge(phase, phase.data)
    }
    _initTaskSelected (data = {}) {
        for (let selected of Object.values(data)) {
            this[selected] = []
        }
    }
    insertPhaseTask (array) {
        array.forEach(item => {
            this._insert(item)
        })
    }
    _insert (phaseTask) {
        if (!(phaseTask instanceof PhaseTask)) {
            this.phase_object_list.push(new PhaseTask())
        }
    }
    createPhaseTask (array, init) {
        let res = []
        array.forEach((item, index) => {
            let phase_task = new PhaseTask({
                data: item
            })
            if (init) {
                phase_task._initTask(phase_task)
                res.push(phase_task)
            } else {
                phase_task.sort = index + 1
                phase_task.formatSelectedTask(phase_task)
                res.push(phase_task)
            }
        })
        return res
    }
    resetTaskSort () {
        this.phase_object_list.forEach((task, index) => {
            task.sort = index + 1
        })
    }
    /**
     * 得到transfer右侧和左侧的数据
     * @return {[type]} [description]
     */
    getTaskSelected (keys) {
        let resLeft = {}
        let resRight = {}
        for (let obj of Object.values(Phase.taskSelectedMap)) {
            resLeft[obj] = Phase.initTabs(keys)
            resRight[obj] = []
        }
        if (this.phase_object_list.length) {
            this.phase_object_list.forEach(phase_task => {
                // 适配器，适配task组件中的数据
                let task = phase_task.formatPhaseTask({}, phase_task)
                let type = Phase.taskSelectedMap[phase_task.type]
                resRight[type].push(task)
                let tabs = resLeft[type]
                tabs.forEach(tab => {
                    if (tab.childType && tab.childType.includes(phase_task.object_type)) {
                        tab.selected.push(task)
                    } else if (tab.type === phase_task.object_type) {
                        tab.selected.push(task)
                    }
                })
            })
        }
        return {
            resLeft,
            resRight
        }
    }
    formatPhaseTask (phase_object_list, type) {
        let res = []
        phase_object_list.forEach(phase_task => {
            if (phase_task.type === type) {
                let task = phase_task.formatPhaseTask({}, phase_task)
                res.push(task)
            }
        })
        return res
    }
    _deleteExtraParam () {
        ['data', 'phase_id', 'requiredTaskSelected', 'unRequiredTaskSelected', 'examTaskSelected'].forEach(item => {
            delete this[item]
        })
    }
}

Phase.taskSelectedMap = {
    1: 'requiredTaskSelected',
    2: 'unRequiredTaskSelected',
    3: 'examTaskSelected'
}
Phase.initTabs = function (keys) {
    return new Task().getTabs(keys)
}

class PhaseTask {
    constructor (options = {}) {
        this.id = 0
        this.type = ''             // 任务类别1-必修，2-选修，3-阶段考试
        this.object_type = ''      // 任务具体类型public-公开课，private-内训课，speaking-药我说，exam-考试
        this.object_id = ''        // 任务id
        this.object_name = ''
        this.sort = 1              // 排序
        for (let [item, value] of Object.entries(options)) {
            this[item] = value
        }
    }
    /**
     * 用户根据transfer弹窗所选的数据结构，插入phaseTask中时需要格式化，
     */
    formatSelectedTask (obj) {
        obj.type = obj.data.taskType
        obj.object_type = obj.data.type
        obj.object_id = obj.data.id
        obj.object_name = obj.data.name
    }
    /**
     * 首次加载的时候也需要将该数据传入对应的组件格式化弹窗中的数据
     */
    formatPhaseTask (selected, phaseTask) {
        selected.taskType = phaseTask.type
        selected.type = phaseTask.object_type
        selected.id = phaseTask.object_id
        selected.name = phaseTask.object_name
        return selected
    }
    _initTask (PhaseTask) {
        objectMerge(PhaseTask, PhaseTask.data)
    }
    _deleteExtraParam () {
        ['data'].forEach(item => {
            delete this[item]
        })
    }
}
