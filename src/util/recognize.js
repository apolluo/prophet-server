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
