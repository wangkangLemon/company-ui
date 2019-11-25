/**
 * User: Pavle Lee <523260513@qq.com>
 * Date: 2017/11/6
 * Time: 上午11:13
 */
import Paper from './paper'

class Lesson {
    constructor () {
        this.id = 0
        this.name = ''
        this.try_enable = 0
        this.forward_enable = 1
        this.material_type = 'video'
        this.material_id = 0
        this.material_name = ''
        this.sort = 0
        this.deleted = false

        this._materialPaper = null
    }

    /**
     * 获取考试素材
     * @returns {Paper}
     */
    get materialPaper () {
        if (!this._materialPaper) {
            let paper = new Paper()
            paper.findById(this.material_id)
            this._materialPaper = paper
        }

        return this._materialPaper
    }

    /**
     * 设置试卷素材
     * @param paper
     * @param material_type
     */
    setMaterialPaper (paper) {
        this._materialPaper = paper
        this.name = paper.name
        this.material_id = paper.id
        this.material_name = paper.name
    }
}

export default Lesson
