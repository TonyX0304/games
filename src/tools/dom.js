// import env from './env'
// import config from './config'

// const docElem = document.documentElement

// 元素在视图内
export function isInViewport(el, offset = 0) {
  if (!el) return false
  const box = el.getBoundingClientRect()
  let top = box.top >= 0
  let left = box.left >= 0
  let bottom = box.bottom <= (window.innerHeight || document.documentElement.clientHeight) + offset
  let right = box.right <= (window.innerWidth || document.documentElement.clientWidth) + offset
  return top && left && bottom && right
}

// 滚动条距离底部的像素
export function scrollBottom(elem) {
  const scrollY = elem.scrollTop // 注意 safari 兼容性
  // const viewportHeight = window.innerHeight || docElem.clientHeight
  const viewportHeight = elem.clientHeight
  const pageHeight = elem.scrollHeight
  return pageHeight - viewportHeight - scrollY
}

// 已滚动到底
export function bottomVisible(elem, distance = 0) {
  const scrollY = elem.scrollTop // 注意 safari 兼容性
  // const viewportHeight = window.innerHeight || docElem.clientHeight
  const viewportHeight = elem.clientHeight
  const pageHeight = elem.scrollHeight
  return viewportHeight + scrollY - pageHeight >= distance || pageHeight < viewportHeight
}
