/**
 * Created by huanghuixin on 2017/3/29.
 */
// 操作tree的帮助方法
import { BitMap, clone } from 'utils/common'

class TreeUtils {
    /**
     * 将arr变为tree的结构
     * @param arr 原始数组
     * @param pidKey 父id的key
     * @param idKey id的key
     *
     * return 结果  [{ item, children:[ {item,children}, {}] }] 没有children 说明是叶子节点
     */
    arr2Tree (arr, pid = 0, pidKey = 'parent_id', idKey = 'id', processItemFn) {
        if (arr == null || arr.length < 1) return null
        let ret = []
        arr.forEach((item) => {
            if (item[pidKey] !== pid)
                return

            let currItem = processItemFn ? processItemFn(item) : {item}
            let nextArr = arr.filter(subitem => {
                return subitem != item
            })
            // id为0 一般表示未分类
            let children = item.id == 0 ? null : this.arr2Tree(nextArr, item[idKey], pidKey, idKey, processItemFn)
            if ((children && children.length > 0)) currItem.children = children
            ret.push(currItem)
        })

        return ret
    }

    // 数组转为elementui的cascader和tree数据结构
    arr2Cascader (arr, pid = 0, pidKey = 'parent_id', idKey = 'id', labelKey = 'name', valKey = 'id', hasChildrenKey = 'has_children') {
        return this.arr2Tree(arr, pid, pidKey, idKey, (item) => {
            return {
                label: item[labelKey],
                value: item[valKey] + '',
                item,
                children: item[hasChildrenKey] ? [{label: '加载中...'}] : null
            }
        })
    }

    // bitmap重构树
    // O(n^2)
    restoreTree (arr) {
        // debugger
        let data = clone(arr)
        let ans = []
        let n = arr.length
        let bm = new BitMap()
        for (let i = 0; i < n; i++) {
            if (!bm.exist(i)) {
                if (!data[i].has_parent) {
                    ans.push(data[i])
                }
                if (data[i].has_children) {
                    data[i].children = []
                }
                bm.add(i)
                for (let j = i + 1; j < n; j++) {
                    if (data[i].id === data[j].pid) {
                        data[i].children.push(data[j])
                        data[j].has_parent = true
                        if (!data[j].has_children) {
                            bm.add(j)
                        }
                    }
                }
            }
        }
        return ans
    }

    /**
     * 查找某一项
     * @param arr 数据
     * @param levelPath 路径 形如 ['1', '2']
     * @param compareKey
     */
    findItem (arr, levelPath, compareKey = 'id') {
        for (let i = 0; i < arr.length; i++) {
            let item = arr[i]
            if (item[compareKey] == levelPath[0]) {
                if (levelPath.length == 1) {
                    return item
                }
                return this.findItem(item.children, levelPath.slice(1), compareKey)
            }
        }
    }
}

export default new TreeUtils()
