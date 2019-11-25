/**
 * User: Pavle Lee <523260513@qq.com>
 * Date: 2017/11/2
 * Time: 上午11:25
 */

import testQuestionService from 'services/exam/testQuestionService'
import Option from './option'

class Question {
    constructor () {
        this.id = 0
        this.type = 0
        this.group_id = void 0
        this.group_name = void ''
        this.description = void ''
        this.score = void 0
        this.image = void ''
        this.explain = void ''
        this.correct = 0
        this.editable = true
        this.tags = []
        this.options = []
    }

    /**
     * 添加题目的选项
     * @param option
     */
    addOption (option) {
        this.options.push(option)
    }

    /**
     * 通过ID查找一个题目，并且填充模型
     * @param group_id
     * @param id
     */
    findById (id) {
        return testQuestionService.view(id).then((ret) => {
            this.setModel(ret.subject)
        })
    }

    setModel (subject) {
        this.id = subject.id
        this.type = subject.type
        this.description = subject.description
        this.score = subject.score
        this.image = subject.image
        this.explain = subject.explain
        this.correct = subject.correct
        this.tags = subject.tags == '' || subject.tags === undefined ? [] : subject.tags.split('，')
        this.group_id = subject.subject_group_id
        this.group_name = subject.subject_group_name
        if (subject.options !== undefined) {
            subject.options.forEach((val, index) => {
                let option = new Option()
                option.id = val.id
                option.description = val.description
                option.correct = val.correct
                option.sort = val.sort

                // 为了兼容后端的数据格式
                if (this.type == 1 && option.correct == 1) {
                    this.correct = index
                    option.correct = 0
                }
                this.addOption(option)
            })
        }
    }

    save () {
        let question = this.format

        if (question.id) {
            return testQuestionService.update(question.id, {
                subject_group_id: question.group_id,
                type: question.type,
                description: question.description,
                explain: question.explain,
                tags: question.tags,
                correct: question.correct,
                image: question.image,
                options: question.options
            })
        } else {
            return testQuestionService.create({
                subject_group_id: question.group_id,
                type: question.type,
                description: question.description,
                explain: question.explain,
                tags: question.tags,
                correct: question.correct,
                image: question.image,
                options: question.options
            })
        }
    }
    get typeName () {
        switch (this.type) {
        case 0:
            return '判断题'
        case 1:
            return '单选题'
        case 2:
            return '多选题'
        default:
            return '未定义'
        }
    }

    get tagString () {
        return this.tags.join('，')
    }

    /**
     * 获取请求数据
     * @returns {Question}
     */
    get format () {
        let question = Object.assign({}, this)
        if (question.type == 1) {
            question.options.forEach((option, index) => {
                if (index == question.correct) {
                    option.correct = 1
                } else {
                    option.correct = 0
                }
            })
            question.correct = 0
        }
        question.tags = this.tags.join('，')
        return question
    }

    setDefaultOption (type) {
        this.options = []
        if (type !== 0) {
            for (let i = 0; i < 4; i++) {
                let option = new Option()
                this.addOption(option)
            }
        }
    }

}

export default Question
