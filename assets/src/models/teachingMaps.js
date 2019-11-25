// common model
// learning map's phase

import { clone, objectMerge } from 'utils/common'
import Task from 'components/dialog/task/model'

export default class Maps {
    constructor (options = {}) {
        this.id = ''
        this.title = ''
        this.image = ''
        this.phase_type = void 0         // 周期类型  将可能不需要传的置为undefined，序列化的时候就会被过滤掉
        this.template_id = ''
        this.phase_list = []
        this.origin_length = 0
        this.total_phase = 0
        this.learning_sequence = 1 //阶段学习顺序
        this.finish_exam_id = ''  // 结业考试id
        this.finish_exam_name = '' // 结业考试名称
        this.publish_users = []
        this.appraisal = {
            appraisal_user: this.initUserEvaluate(),
            appraisal_coacher: this.initCoacherEvaluate(),
            is_default_user_rule: 1,
            is_default_coacher_rule: 1,
            hidden_coacher_appraisal: 0,
        }
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
    initUserEvaluate () {
        return {
            is_coacher_appraisal: 0,
            is_finish_exam: 0,   // 通过结业考试
            is_pass_phase: 0,
            is_pass_exam: 0,
            standards: this._initEvaluateStandards(),
            pass_phase_number: 0,
            multi_rule: 0
        }
    }
    initCoacherEvaluate () {
        return {
            is_user_appraisal: 0,
            is_user_pass: 0,
            standards: this._initEvaluateStandards(),
            user_pass: 0,
            multi_rule: 0
        }
    }
    _initEvaluateStandards () {
        return [
            {
                level: 0,
                inequation: 0,
                value: 0,
            },
            {
                level: 3,
                inequation: 1,
                value: 0,
            }
        ]
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
    save () {
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
        if (res.appraisal.appraisal_user) {
            if (!res.finish_exam_id) {
                res.appraisal.appraisal_user.is_finish_exam = 0
                res.appraisal.appraisal_user.is_pass_exam = 0
            }
            if (!res.appraisal.appraisal_user.is_coacher_appraisal) {
                res.appraisal.appraisal_user.standards = this._initEvaluateStandards()
            }
            if (!res.appraisal.appraisal_user.is_pass_phase) {
                res.appraisal.appraisal_user.pass_phase_number = 0
            }
        }
        if (res.appraisal.appraisal_coacher) {
            if (!res.appraisal.appraisal_coacher.is_user_appraisal) {
                res.appraisal.appraisal_coacher.standards = this._initEvaluateStandards()
            }
        }
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
                        if (tab.type === 'medicine_task') {
                            tab.selected.push(task.name)
                        } else if (tab.type === 'practical_operation') {
                            tab.selected.push(task.name)
                        } else {
                            tab.selected.push(task)
                        }
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
        this.po_course_id = 0
        this.medicine_list = []
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
        obj.po_course_id = obj.data.po_course_id
        obj.medicine_list = obj.data.medicine_list
    }
    /**
     * 首次加载的时候也需要将该数据传入对应的组件格式化弹窗中的数据
     */
    formatPhaseTask (selected, phaseTask) {
        selected.taskType = phaseTask.type
        selected.type = phaseTask.object_type
        selected.id = phaseTask.object_id
        selected.name = phaseTask.object_name
        selected.medicine_list = phaseTask.medicine_list
        selected.po_course_id = phaseTask.po_course_id
        selected.po_course_name = phaseTask.data.po_course_name // po_course_name不是phase_task类的属性
        if (phaseTask.object_type === 'medicine_task') {
            selected.po_course_name = (phaseTask.medicine_list || []).map(item => item.name).join(',')
        }
        return selected
    }
    _initTask (PhaseTask) {
        objectMerge(PhaseTask, PhaseTask.data)
        if (PhaseTask.object_type === 'medicine_task') {
            PhaseTask.data.po_course_name = (PhaseTask.medicine_list || []).map(item => item.name).join(',')
        }
    }
    _deleteExtraParam () {
        ['data'].forEach(item => {
            delete this[item]
        })
    }
}
