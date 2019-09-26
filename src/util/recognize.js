var bodyChildren = Array.from(document.body.children)
var stepResult = []
const BODY = {
  WIDTH:
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth,
  HEIGHT:
    window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight
}
const MAIN = {
  WIDTH: 0.5,
  HEIGHT: 0.5
}
const sizeRule = (rule, { width, height }, { WIDTH, HEIGHT } = BODY) => {
  if (width < WIDTH * rule.WIDTH || height < HEIGHT * rule.HEIGHT) {
    return false
  }
  return true
}
const viweRule = (
  rule,
  { offsetTop, offsetLeft },
  { WIDTH, HEIGHT } = BODY
) => {
  if (offsetTop > HEIGHT * rule.HEIGHT || offsetLeft > WIDTH * rule.WIDTH) {
    return false
  }
  return true
}

const recognize = (rule, target, compTarget) => {
  let res = target || document.body
  let currentRes
  let list = Array.from(res.children)

  if (!list.length) {
    console.log('res', res)
    return res
  }
  let viewList = list.filter(item => {
    return viweRule(rule, {
      offsetTop: item.offsetTop || 0,
      offsetLeft: item.offsetLeft || 0
    })
  })
  console.log('viewList', viewList)
  currentRes = viewList.filter(item => {
    return sizeRule(rule, {
      width: item.offsetWidth || 0,
      height: item.offsetHeight || 0
    })
  })
  console.log('currentRes', currentRes)
  if (!currentRes.length) {
    console.log('res', res)
    return res
  }
  currentRes.forEach(currentItem => {
    recognize(rule, currentItem)
  })
}
// 获取主要区域的链接，按路径XPATH?分类，数量最多，字体最大的即为列表，
// 机器学习特征 字体大小 数量 是否在main
let mainContent = recognize(MAIN)
let allLink = mainContent.querySelectorAll('a')
let linkList
// 是否兄弟
const LIST = {
  font
}
function getstyle (obj, key) {
  if (obj.currentStyle) {
    return obj.currentStyle[key]
  } else {
    return getComputedStyle(obj, false)[key]
  }
}
const isSibling = (rule, target, compTarget) => {}
const recognizeList = dom => {
  let parent = dom.parentNode
  let tag = dom.tagName.toLowerCase()
  if (parent === document.body) {
    return
  }
  let siblings = parent.getElementsByTag(tag)
  // 是否有兄弟
  if (siblings.length > 1) {
  }
}
