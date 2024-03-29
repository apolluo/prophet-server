'use strict'
const puppeteer = require('puppeteer')
const genericPool = require('generic-pool')

/**
 * 初始化一个 Puppeteer 池
 * @param {Object} [options={}] 创建池的配置配置
 * @param {Number} [options.max=10] 最多产生多少个 puppeteer 实例 。如果你设置它，请确保 在引用关闭时调用清理池。 pool.drain().then(()=>pool.clear())
 * @param {Number} [options.min=1] 保证池中最少有多少个实例存活
 * @param {Number} [options.maxUses=2048] 每一个 实例 最大可重用次数，超过后将重启实例。0表示不检验
 * @param {Number} [options.testOnBorrow=2048] 在将 实例 提供给用户之前，池应该验证这些实例。
 * @param {Boolean} [options.autostart=false] 是不是需要在 池 初始化时 初始化 实例
 * @param {Number} [options.idleTimeoutMillis=3600000] 如果一个实例 60分钟 都没访问就关掉他
 * @param {Number} [options.evictionRunIntervalMillis=180000] 每 3分钟 检查一次 实例的访问状态
 * @param {Object} [options.puppeteerArgs={}] puppeteer.launch 启动的参数
 * @param {Function} [options.validator=(instance)=>Promise.resolve(true))] 用户自定义校验 参数是 取到的一个实例
 * @param {Object} [options.otherConfig={}] 剩余的其他参数 // For all opts, see opts at https://github.com/coopernurse/node-pool#createpool
 * @return {Object} pool
 */
const initPuppeteerPool = (options = {}) => {
  const {
    max = 10,
    min = 2,
    maxUses = 2048,
    testOnBorrow = true,
    autostart = false,
    idleTimeoutMillis = 3600000,
    evictionRunIntervalMillis = 180000,
    puppeteerArgs = {},
    validator = () => Promise.resolve(true),
    ...otherConfig
  } = options

  const factory = {
    create: () =>
      puppeteer.launch(puppeteerArgs).then(instance => {
        // 创建一个 puppeteer 实例 ，并且初始化使用次数为 0
        instance.useCount = 0
        return instance
      }),
    destroy: instance => {
      instance.close()
    },
    validate: instance => {
      // 执行一次自定义校验，并且校验校验 实例已使用次数。 当 返回 reject 时 表示实例不可用
      return validator(instance).then(valid =>
        Promise.resolve(valid && (maxUses <= 0 || instance.useCount < maxUses))
      )
    }
  }
  const config = {
    max,
    min,
    testOnBorrow,
    autostart,
    idleTimeoutMillis,
    evictionRunIntervalMillis,
    ...otherConfig
  }
  const pool = genericPool.createPool(factory, config)
  const genericAcquire = pool.acquire.bind(pool)
  // 重写了原有池的消费实例的方法。添加一个实例使用次数的增加
  pool.acquire = () =>
    genericAcquire().then(instance => {
      instance.useCount += 1
      return instance
    })
  pool.use = fn => {
    let resource
    return pool
      .acquire()
      .then(r => {
        resource = r
        return resource
      })
      .then(fn)
      .then(
        result => {
          // 不管业务方使用实例成功与后都表示一下实例消费完成
          pool.release(resource)
          return result
        },
        err => {
          pool.release(resource)
          throw err
        }
      )
  }
  return pool
}
module.exports = initPuppeteerPool
// 如何使用：

// 在业务中取出实例使用
// const page = await pool.use(instance=>{
// 	const page = await instance.newPage()
// 	await page.goto('http://xxx.xxx', { timeout: 120000 })
// 	// do XXX ...
//     return page
// })
// do XXX ...

// 应该在服务重启或者关闭时执行
// pool.drain().then(() => pool.clear()

// main
// const initPuppeteerPool = require('./util/puppeteer-pool')
// const { EventEmitter } = require('events')
// EventEmitter.defaultMaxListeners = 30
// class AppBootHook {
//   constructor(app) {
//     this.app = app
//   }
//   async didLoad() {
//     // 所有的配置已经加载完毕
//     // 可以用来加载应用自定义的文件，启动自定义的服务
//     this.app.pool = initPuppeteerPool()
//   }
//   async beforeClose() {
//     if (this.app.pool.drain) {
//       await this.app.pool.drain().then(() => this.app.pool.clear())
//     }
//   }
// }
// module.exports = AppBootHook

// server
// const Service = require('egg').Service
// class ScreenshotService extends Service {
//     renderPage(url) {
//         const { app, config } = this
//         const imageBuffer = await app.pool.use(async instance => {
//             // 1. 创建一个新窗口
//             const page = await instance.newPage()
//             await page.goto(url, { timeout: 120000 })
//             // 2. 截图参数，截图
//             const buf = await page.screenshot({ ...imgOutOption, clip: opt })
//             return buf
//         })
//         return imageBuffer
//     }
// }
