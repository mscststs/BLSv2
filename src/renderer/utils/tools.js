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
