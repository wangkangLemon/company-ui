/**
 * User: Pavle Lee <523260513@qq.com>
 * Date: 2017/11/2
 * Time: 下午3:14
 */
import testLibraryService from 'services/exam/testLibraryService'

class Library {
    constructor () {
        this.id = 0
        this.name = ''
        this.description = ''
        this.single_total = 0
        this.multi_total = 0
        this.judge_total = 0
        this.subject_total = 0
    }

    /**
     * 填充一个模型
     * @param id
     * @param name
     * @param description
     * @param data
     */
    setModel (data) {
        this.id = data.id
        this.name = data.name
        this.description = data.description
        this.single_total = data.single_num
        this.multi_total = data.multi_num
        this.judge_total = data.judge_num
        this.subject_total = data.subject_num
    }

    /**
     *
     * @param group_id
     */
    findById (group_id) {
        return testLibraryService.view(group_id).then((ret) => {
            this.setModel(ret.subject_group)
        })
    }
}

export default Library
