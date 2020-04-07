import { remote } from 'electron'
import fs from 'fs-extra'
import eve from './events'
import autoSlideScript from './script/autoSlide' // 自动滑动登录

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
  let { dialog } = remote
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
 * @description 导入 json 文件
 * @return {object} obj
 */
export async function readJsonFile () {
  let { dialog } = remote
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

/**
 * @description 以用户名和密码登录
 * @param {string} username
 * @param {string} password
 */
export async function userLogin (username = '', password = '') {
  // Step 1 打开浏览器页面
  let currentWindow = remote.getCurrentWindow()
  let child = new remote.BrowserWindow({
    title: 'bilibili 快速登录',
    parent: currentWindow,
    webPreferences: {
      // devTools: false
    },
    darkTheme: true
  })
  child.show()
  // JS 在处理双层事件循环和跨作用域操作时，简直反人类，只能通过这种写法来解决
  return Promise.race([
    // 函数 1 ，正常流程，完成登录和返回Cookies
    (async () => {
      child.loadURL('https://account.bilibili.com/ajax/miniLogin/minilogin') // B 站登录地址
      // Step 2 填写用户名密码(如果有的话)
      let childWebContents = child.webContents
      childWebContents.on('new-window', function (event) {
        event.preventDefault() // 阻止打开新窗口
      })
      await new Promise((resolve, reject) => {
        childWebContents.once('did-finish-load', () => {
          resolve()
        })
      })
      childWebContents.executeJavaScript(`
        document.querySelector("#login-username").value = "${username}";
        document.querySelector("#login-passwd").value = "${password}";
        ${autoSlideScript}
      `)
      console.log(autoSlideScript)
      // 等待重定向 -- 可能密码
      let cookies = await new Promise((resolve, reject) => {
        childWebContents.once('will-navigate', (event, url) => {
          if (~url.indexOf('https://passport.biligame.com/crossDomain')) {
            // Step 3 从 url 解析出 cookies
            let { searchParams } = new URL(url)
            let expires = searchParams.get('Expires')
            let cookies = ['DedeUserID', 'DedeUserID__ckMd5', 'SESSDATA', 'bili_jct'].map(key => {
              return {
                name: key,
                value: searchParams.get(key),
                expires: expires
              }
            })
            resolve(cookies)
          }
        })
      })
      child.close()
      return cookies
    })(),
    // 函数 2 , 意外流程，检查到窗口关闭时，直接返回
    new Promise((resolve, reject) => {
      child.on('close', (event) => {
        reject(new Error('login refused'))
      })
    })
  ])
}
