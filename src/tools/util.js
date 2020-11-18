// 常用工具
const _toString = Object.prototype.toString

/**
 * Perform no operation.
 */
export function noop() {}

// these helpers produces better vm code in JS engines due to their
// explicitness and function inlining
export function isUndef(v) {
  return v === undefined || v === null
}

export function isDef(v) {
  return v !== undefined && v !== null
}

export function isFunction(obj) {
  return typeof obj === 'function'
}

export function isNumber(obj) {
  let type = typeof obj
  return (type === 'number' || type === 'string') && !isNaN(obj - parseFloat(obj))
}

export function type(obj) {
  return _toString.call(obj)
}

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
export function isObject(obj) {
  return obj !== null && typeof obj === 'object'
}

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
export function isPlainObject(obj) {
  return type(obj) === '[object Object]'
}

export function isEmptyObject(obj) {
  return !Object.keys(obj).length
}

export function isRegExp(v) {
  return type(v) === '[object RegExp]'
}

export function isDate(v) {
  return type(v) === '[object Date]'
}

/**
 * Convert a value to a string that is actually rendered.
 */
export function toString(val) {
  return val == null ? '' : typeof val === 'object' ? JSON.stringify(val, null, 2) : String(val)
}

/**
 * Convert a input value to a number for persistence.
 * If the conversion fails, return original string.
 */
export function toNumber(val) {
  const n = parseFloat(val)
  return isNaN(n) ? val : n
}

/**
 * Remove an item from an array
 */
export function remove(arr, item) {
  if (arr.length) {
    const index = arr.indexOf(item)
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

/**
 * Convert an Array-like object to a real Array.
 */
export function toArray(list, start) {
  start = start || 0
  let i = list.length - start
  const ret = new Array(i)
  while (i--) {
    ret[i] = list[i + start]
  }
  return ret
}

// 格式化时间为苹果系统可兼容的格式
export function fixDate(date) {
  if (typeof date === 'string') {
    return date.replace(/-/g, '/').replace(/(\+\d{2})(\d{2})$/, '$1:$2')
  }
  return date
}

// 获取当前时间
export function getTime(fmt = 'yyyy-MM-dd hh:mm:ss') {
  return formatDate(new Date(), fmt)
}

// 时间格式化
// format(new Date(), 'yyyy-M-d h:m:s.S')      => 2006-7-2 8:9:4.18
// format(new Date(), 'yyyy-MM-dd hh:mm:ss.S') => 2006-07-02 08:09:04.423
// format(new Date(), 'yyyy-MM-dd hh:mm:ss')   => 2006-07-02 08:09:04
export function formatDate(date = new Date(), fmt = 'yyyy-MM-dd') {
  if (!date) return date
  if (typeof date === 'string') date = fixDate(date)
  const time = new Date(date)
  if (!isDate(time)) return date
  let o = {
    'M+': time.getMonth() + 1, // 月
    'd+': time.getDate(), // 日
    'h+': time.getHours(), // 小时
    'm+': time.getMinutes(), // 分
    's+': time.getSeconds(), // 秒
    'q+': Math.floor((time.getMonth() + 3) / 3), // 季度
    'S': time.getMilliseconds() // 毫秒
  }

  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (time.getFullYear() + '').substr(4 - RegExp.$1.length))
  }

  for (let k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }

  return fmt
}

// 时间对象数组转字符串
export function formatDates(dates, separator = ',') {
  if (!Array.isArray(dates)) return dates
  return dates.filter(date => date).map(date => formatDate(date)).join(separator)
}

// 高亮关键字
export function highlight(text, keyword = '') {
  if (typeof text !== 'string' || !keyword) return text
  const reg = new RegExp(`${keyword}+`, 'gi')
  return reg.test(text) ? text.replace(reg, '<span class="highlight">$&</span>') : text
}

// 获取文件扩展名
export function getFileExtension(fileName) {
  // return fileName.substring(fileName.lastIndexOf('.') + 1)
  return fileName.lastIndexOf('.') === -1 ? '' : fileName.split('.').pop()
}

// 深拷贝
export function deepClone(to, obj) {
  // 如果没有目录对象参数
  if (!obj) {
    obj = to
    to = {}
  }

  for (const k in obj) {
    if (obj.hasOwnProperty(k)) {
      if (isObject(obj[k])) {
        to[k] = Array.isArray(obj[k]) ? [] : {}
        deepClone(to[k], obj[k])
      } else {
        to[k] = obj[k]
      }
    }
  }
  return to
}

// 浅拷贝
export function clone(to, obj) {
  // 如果没有目录对象参数
  if (!obj) {
    obj = to
    to = {}
  }

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      to[key] = obj[key]
    }
  }
  return to
}

// 拷贝对象
export function cloneObject(obj) {
  if (!obj) return {}
  return JSON.parse(JSON.stringify(obj))
}

/**
 * Merge an Array of Objects into a single Object.
 */
export function toObject(arr) {
  const res = {}
  for (let i = 0; i < arr.length; i++) {
    if (arr[i]) {
      clone(res, arr[i])
    }
  }
  return res
}

/**
 * Ensure a function is called only once.
 */
export function once(fn) {
  let called = false
  return function() {
    if (!called) {
      called = true
      fn.apply(this, arguments)
    }
  }
}
