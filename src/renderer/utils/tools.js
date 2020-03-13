import {remote} from 'electron'
import fs from 'fs-extra'
import eve from './events'

/**
 * @description 将一个函数的参数和结果进行缓存
 * @param {function} func
 */
export function cacheAble (func) {
  let memoryStorage = {}
  return function (...args) {
    let argsKey = JSON.stringify(args)
    if (memoryStorage[argsKey] === undefined) {
      memoryStorage[argsKey] = func(...args)
    }
    return memoryStorage[argsKey]
  }
}

/**
 * @description 格式化时间
 * @param {Date} date
 * @param {String} fmt
 */
export function formatTime (date = new Date(), fmt = 'YYYY-MM-DD HH:mm:ss') {
  date = typeof date === 'number' ? new Date(date) : date
  var o = {
    'M+': date.getMonth() + 1,
    'D+': date.getDate(),
    'h+': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12,
    'H+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3),
    S: date.getMilliseconds()
  }
  var week = {
    '0': '\u65e5',
    '1': '\u4e00',
    '2': '\u4e8c',
    '3': '\u4e09',
    '4': '\u56db',
    '5': '\u4e94',
    '6': '\u516d'
  }
  if (/(Y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + '').substr(4 - RegExp.$1.length)
    )
  }
  if (/(E+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (RegExp.$1.length > 1
        ? RegExp.$1.length > 2 ? '\u661f\u671f' : '\u5468'
        : '') + week[date.getDay() + '']
    )
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1
          ? o[k]
          : ('00' + o[k]).substr(('' + o[k]).length)
      )
    }
  }
  return fmt
}

/**
 * @description 导出 json 文件
 * @param {object} obj
 */
export async function writeJsonFile (obj) {
  let {dialog} = remote
  try {
    let filePath = await dialog.showSaveDialog({
      filters: [
        {
          name: 'JSON 数据',
          extensions: ['json']
        }
      ]
    })
    if (filePath) {
      await fs.outputJson(filePath, obj, {
        spaces: 4
      })
      eve.emit('toast', '导出成功')
    }
  } catch (e) {
    // canceled
  }
}

/**
 * @description 导出 json 文件
 * @return {object} obj
 */
export async function readJsonFile () {
  let {dialog} = remote
  try {
    let [filePath] = await dialog.showOpenDialog({
      filters: [
        {
          name: 'JSON 数据',
          extensions: ['json']
        }
      ],
      properties: ['openFile']
    })
    if (filePath) {
      let f = await fs.readJson(filePath)
      eve.emit('toast', '导入成功')
      return f
    }
  } catch (e) {
    console.log(e)
    return null
    // canceled
  }
}
