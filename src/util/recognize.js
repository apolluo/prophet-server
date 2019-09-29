// var bodyChildren = Array.from(document.body.children)
// var stepResult = []
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
  TAG: 'main',
  WIDTH: 0.5,
  HEIGHT: 0.5,
  TOP: 0.55,
  LEFT: 0.33
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
  if (offsetTop > HEIGHT * rule.TOP || offsetLeft > WIDTH * rule.LEFT) {
    return false
  }
  return true
}
const textMostRule = () => {}

const recognize = (rule, target, compTarget) => {
  let res = target || document.body
  if (rule.TAG) {
    let main = res.querySelector(rule.TAG)
    if (main) return main
  }
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
  for (var currentItem of currentRes) {
    return recognize(rule, currentItem)
  }
  // return currentRes.forEach(currentItem => {
  //   return recognize(rule, currentItem)
  // })
}
// let mainContent = recognize(MAIN)
// console.log('mainContent', mainContent)

// 获取主要区域的链接，按路径XPATH?分类，数量最多，字体最大的即为列表，
// 机器学习特征 字体大小 数量 是否在main

// let allLink = mainContent.querySelectorAll('a')
// let linkList
// 是否兄弟
const LIST = ['font', 'className']
function getstyle (obj, key) {
  if (obj.currentStyle) {
    return obj.currentStyle[key]
  } else {
    return getComputedStyle(obj, false)[key]
  }
}
var isSibling = (rules, target, compTarget) => {
  for (let rule of rules) {
    switch (rule) {
      case 'font':
        if (getstyle(target, rule) !== getstyle(compTarget, rule)) {
          return false
        }
        break
      case 'className':
        if (target.className !== compTarget.className) {
          return false
        }
        break
    }
  }
  return true
}
var recognizeBlock = block => {
  let links = recognizeLink(block)
  let title, href, title2
  if (!links.length) {
    title = recognizeTitle(block)
  } else {
    title = links[0]
    href = title.href
    if (/http/.test(title.innerText)) {
      title2 = recognizeTitle(block)
    }

    title = title2 ? title2.innerText : title.innerText
  }

  return {
    title,
    href,
    block
  }
}
var recognizeListBlock = dom => {
  let parent = dom.parentNode
  let tag = dom.tagName.toLowerCase()
  if (parent === document.body) {
    console.log('no sibling')
    return null
  }
  let blockList = []
  let siblings = Array.from(parent.children)
  // 是否有兄弟
  if (siblings.length > 1) {
    for (var sibling of siblings) {
      if (sibling.tagName.toLowerCase() !== tag) {
        continue
      }
      if (sibling === dom) {
        blockList.push(recognizeBlock(sibling))
        continue
      }
      if (isSibling(LIST, sibling, dom)) {
        blockList.push(recognizeBlock(sibling))
      }
    }
    if (blockList.length > 1) {
      return blockList
    }
  }
  return recognizeListBlock(parent)
}
// 需要加上属于第几个孩子a:nth-child(1)
var recognizeListPath = dom => {
  let getDomSelector = dom => {
    let tag = dom.tagName.toLowerCase()
    let className = dom.className
    let domSelector
    if (className) {
      domSelector = `${tag}.${className}`
    } else {
      domSelector = `${tag}`
    }
    return domSelector
  }

  let path = getDomSelector(dom)
  let passList = Array.from(dom.parentNode.querySelectorAll(path))
  let list = fontSizeSort(passList)
  let title, fontSize
  if (list && list.length) {
    title = list[0]
    fontSize = title.fontSize
  } else {
    console.log('no text')
    return null
  }
  if (title != dom) {
    path = getDomSelector(title)
  }
  console.log(path, fontSize, title)
  let recognizeByPath = dom => {
    let parent = dom.parentNode
    let parentPath = getDomSelector(parent)
    path = `${parentPath}>${path}`
    let list = Array.from(document.querySelectorAll(path))
    console.log(path, list)
    if (list.length < 2) return null
    if (parent === document.body) {
      console.log('no sibling')
      return {
        path,
        list,
        fontSize
      }
    }
    let last = list[list.length - 1]
    if (isSibling(LIST, list[0], last)) {
      return {
        path,
        list,
        fontSize
      }
    } else if (passList.includes(list[0]) && passList.includes(last)) {
      list = list.filter(item => {
        return isSibling(LIST, item, title)
      })
      return {
        path,
        list,
        fontSize
      }
    }
    return recognizeByPath(parent)
  }
  return recognizeByPath(title)
}

const recognizeTitle = dom => {
  let children = dom.querySelectorAll('*')
  let list = fontSizeSort(children)
  if (list && list.length) return list[0]
  return null
}
// 降序排列
const fontSizeRule = (text1, text2) => {
  let fontSize1 = parseInt(getstyle(text1, 'fontSize'))
  let fontSize2 = parseInt(getstyle(text2, 'fontSize'))
  text1.fontSize = fontSize1
  text2.fontSize = fontSize2
  if (fontSize1 == fontSize2) {
    return text1.innerText.length - text2.innerText.length
  }
  return fontSize2 - fontSize1
}
const fontSizeSort = lists => {
  let linkList = []
  for (let list of lists) {
    if (list.innerText.trim()) linkList.push(list)
  }
  if (linkList.length > 1) {
    linkList.sort(fontSizeRule)
  } else if (linkList.length == 1) {
    linkList[0].fontSize = parseInt(getstyle(linkList[0], 'fontSize'))
  }

  return linkList
}
const recognizeLink = dom => {
  let allLinks = dom.querySelectorAll('a')
  return fontSizeSort(allLinks)
}
var recognizeList = container => {
  let dom = container || document.body
  let linkList = Array.from(dom.querySelectorAll('a'))
  let blockLists = []
  while (linkList.length > 1) {
    // 从顶部的链接开始找
    let link = linkList.shift()
    let blockList = recognizeListPath(link)
    if (!blockList) continue
    // 移除已经识别的链接
    linkList = linkList.filter(item => {
      return !blockList.list.includes(item)
    })
    console.log(link, blockList)
    blockLists.push(blockList)
  }
  return blockLists
}
var recognizeNumList = container => {
  let linkLists = recognizeList(container)
  for (var linkList of linkLists) {
    if (
      /[0-9一二三四五六七八九十零]/.test(
        linkList.list[parseInt(linkList.list.length / 2)].innerText
      )
    ) {
      return linkList.list.map(item => {
        return {
          title: item.innerText,
          href: item.href
        }
      })
    }
  }
  return null
}
var recognizePageBtn = () => {
  let linkBtns = document.querySelectorAll('a')
  let btns = []
  let exep = [/上一/, /目录/, /下一/]
  for (var linkBtn of linkBtns) {
    for (var i = 0; i < exep.length; i++) {
      if (exep[i].test(linkBtn.innerText)) {
        btns.push(linkBtn)
        console.log(exep[i], linkBtn)
        exep.splice(i, 1)
        continue
      }
    }
    if (!exep.length) break
  }
  console.log(btns)
  return btns.map(btn => {
    return {
      text: btn.innerText,
      href: btn.href
    }
  })
}
var recognizeContent = () => {
  let mainContent = recognize(MAIN)
  let btns = recognizePageBtn()
  return {
    text: mainContent.innerText,
    btns
  }
}
// var recognizeList = container => {
//   let dom = container || document.body
//   let linkList = recognizeLink(dom)
//   let blockLists = []
//   while (linkList.length > 1) {
//     // 从字体最大的链接开始找
//     let maxLink = linkList.shift()
//     // let blockList = recognizeListBlock(maxLink)
//     let blockList = recognizeListPath(maxLink)
//     if (!blockList) continue
//     linkList = linkList.filter(item => {
//       return !blockList.list.includes(item)
//     })
//     console.log(maxLink, blockList)
//     blockLists.push(blockList)
//   }
//   return blockLists
// }
// module.exports = {
//   recognize,
//   recognizeListBlock,
//   recognizeList,
//   recognizePageBtn
// }
