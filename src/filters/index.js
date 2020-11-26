import dayjs from 'dayjs'

export const filters = {
  // 文字超出截断
  wordSlice(word, length) {
    return word.length > length ? word.slice(0, length - 1) + '...' : word
  },

  // 分转元
  fen2yuan(value) {
    return !isNaN(value) ? (value / 100).toFixed(2) : value
  },

  // 去掉货币符号
  delyuan(value) {
    return typeof value === 'string' ? Number(value.replace('￥', '')) : 0
  },

  // 格式化银行卡号
  fmtBankcard(value) {
    if (value && typeof value === 'string') {
      value = value.slice(0, 4) + ' *** *** ' + value.slice(-4)
    }
    return value
  },

  // 附件地址指向本地，通过服务器反向代理
  proxyFile(url, path = 'customerfile') {
    // if (location.hostname === 'localhost') return url
    // return url && url.replace(/^(https?:)?\/\/yungehuo\.oss-cn-shenzhen\.aliyuncs\.com\/customerfile\//i, '/customerfile/')
    return url && url.replace(new RegExp(`^(https?:)?//yungehuo\\.oss-cn-shenzhen\\.aliyuncs\\.com/${path}/`, 'i'), `/${path}/`)
  },

  /**
   * 功能：将时间戳按照给定的时间/日期格式进行处理
   * @param {Number} date 时间戳
   * @param {String} fmt 时间格式 'YYYY-MM-DD HH:mm:ss'
   * @returns {String} 规范后的 时间/日期 字符串
   */
  // fmtDate: (time, fmt) => formatDate(time, fmt),
  fmtDate(time, fmt = 'YYYY-MM-DD HH:mm:ss') {
    if (!time) return time
    return dayjs(time).format(fmt)
  },

  // 时间戳格式化为时分秒（00:00:00）
  sec2time(sec, fmt = '00:00') {
    if (!sec || sec <= 0) return fmt
    // sec = Math.floor(sec)
    let h = String(Math.floor(sec / 3600)).padStart(2, '0')
    let m = String(Math.floor(sec / 60) % 60).padStart(2, '0')
    let s = String(sec % 60).padStart(2, '0')
    if (h > 0) {
      return `${h}:${m}:${s}`
    } else {
      return `${m}:${s}`
    }
  },

  // 时分秒（00:00:00）转为时间戳
  time2sec(time) {
    if (!time) return ''
    var h = time.split(':')[0]
    var m = time.split(':')[1]
    var s = time.split(':')[2]
    return Number(h * 3600) + Number(m * 60) + Number(s)
  }
}

export default Vue => {
  Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
  })
}
