/* 使用一个window.localStorage["bls-config"]进行初始化和数据保存 */
import events from '../events'
import templateConfig from './config.template'
import {writeJsonFile, readJsonFile} from '../tools'

class store {
  constructor (storeObj, storeID) {
    if (storeObj[storeID]) {
      this.data = JSON.parse(storeObj[storeID])
    } else {
      storeObj[storeID] = '{}'
      this.data = {}
    }
    this.store = {storeObj: storeObj, storeID: storeID}
    this.initTemplateConfig()
  }
  /**
   * 初始化，合并 Template 到 data 中
   */
  initTemplateConfig () {
    this.update((data) => {
      // 用只有 templateConfig 中存在的值来覆盖 data
      Object.assign(data, templateConfig, data)
    })
  }
  /**
   * Store 持久化函数，写数据时必须使用这个方法来完成写入
   * @param {function} cb
   */
  update (cb) {
    /* 使用callback进行修改 */
    if (typeof (cb) === 'function') {
      cb(this.data)
    } else if (typeof (cb) === 'object') { // 传递新的对象,用深拷贝解除引用
      this.data = JSON.parse(JSON.stringify(cb))
    } else if (typeof (cb) === 'string') {
      this.data = JSON.parse(cb)
    } else {
      return false
    }
    this.save()
    events.emit('storeUpdated')
    return true
  }
  /**
   * 导出到文件
   */
  async exportToFile () {
    await writeJsonFile({
      '_bls_storage': '_bls_storage',
      ...this.data
    })
  }
  /**
   * 从文件导入
   */
  async readFromFile () {
    try {
      let data = await readJsonFile()
      if (data && data['_bls_storage']) { // 检查校验位
        this.data = data
        this.initTemplateConfig()
        this.update()
      }
    } catch (e) {
    }
  }
  toString () {
    return JSON.stringify(this.data)
  }
  save () {
    this.store.storeObj[this.store.storeID] = JSON.stringify(this.data)
  }
}

export default store
