import { Injectable, Logger } from '@nestjs/common';
import * as puppeteer from 'puppeteer'
import { generateFileName, checkAndGenerateDir } from '@/util/file'
import { CHROME_PATH, RULE_TARGET_TYPE } from '@/config';
import { ISource } from '@/source/interfaces/source.interface';
import { IRule } from '@/rule/interfaces/rule.interface';
import { SourceService } from '@/source/source.service';
import { async } from 'rxjs/internal/scheduler/async';
import { ITask } from '@/task/interfaces/task.interface';
import { CreateTaskDto } from '@/task/dto/create-task.dto';
import { TagService } from '@/tag/tag.service';
import { PoolService } from '@/pool/pool.service';
// import { recognizeList, recognizePageBtn } from '@/util/recognize'

@Injectable()
export class CrawlerService {
    private readonly logger = new Logger(CrawlerService.name)
    private browser
    private page
    constructor(private readonly sourceService: SourceService,
        private readonly tagService: TagService, private readonly poolService: PoolService) {

    }
    private async launchPage() {
        this.browser = await puppeteer.launch({
            //headless: false,
            //避免Puppeteer被前端JS检测
            ignoreDefaultArgs: ["--enable-automation"],
            executablePath: CHROME_PATH,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        })
        this.logger.log('打开 chrome')
        this.page = await this.browser.newPage()
        this.page.on('console', msg => {
            console.log(msg.text())
            // for (let i = 0; i < msg.args().length; ++i)
            //     console.log(`${i}: ${msg.args()[i]}`);
        });
    }
    //爬任务，爬多个源
    async crawl(taskDto) {
        //await this.init()
        let sourceIds = taskDto.source
        console.log('sourceIds', sourceIds)
        console.log(taskDto)
        const crawlSources = async sources => {
            console.log('sources', sources)
            let crawPromises = [], that = this
            for (var i = 0; i < sources.length; i++) {
                crawPromises.push(that.crawlSource(sources[i], taskDto, i))
            }
            return Promise.all(crawPromises)
        }
        return await this.sourceService.findByIds(sourceIds)
            .then(crawlSources)
            .then((res) => {
                console.log('crawlSources then', res)
                return res
            })
    }
    //爬某个源/网页
    async crawlSource(source: ISource, taskDto, index) {
        let url;
        switch (source.type) {
            case 1:
                url = source.src
                break;
            case 2:
                let urlApi = 'let searchParams=taskDto.searchParams;' + source.searchApi
                console.log(urlApi)
                url = eval('let searchParams=taskDto.searchParams;' + source.searchApi)
                break;
        }
        if (!url) return;
        let crawlSourceRes = await this.crwalUrl(url, source.parse)
        if (!source.crawlMore) {
            return crawlSourceRes
        } else if (source.crawlMore == 1) {
            //return crawlSourceRes
            if (crawlSourceRes.list && crawlSourceRes.list.length)
                this.autoCrwalPagesByList(crawlSourceRes.list)

        }

    }
    async autoCrwalPagesByList(urls) {
        try {
            // await this.launchPage()
            let i = 0
            let that = this
            for (let url of urls) {
                console.log('page:', url.link.href)
                i++;
                if (i > 3) break;
                let content = await that.crawlAndRecognize(url.link.href, 'mainContent', true)
                let tags = await that.tagService.getTags(content)
                console.log(tags)
            }
            await this.browser.close()

        } catch (error) {
            console.log(error)
            await this.browser.close()
        }
    }

    async crawlAndRecognize(url, rule, isLaunch = false) {
        console.log('crawl url list', url, rule)
        // if (!isLaunch) await this.launchPage()
        try {
            // await this.page.goto(url, { waitUntil: 'networkidle0' })
            let page =  await this.poolService.pool.use(async instance=>{
                const page = await instance.newPage()
                await page.goto(url, {waitUntil: 'networkidle0', timeout: 120000 })
                return page
            })
            await page.addScriptTag({ path: './src/util/recognize.js' });
            let results = await page.evaluate(rule => {
                switch (rule) {
                    case 'mainContent':
                        return (window as any).recognizeMainContent()
                    case 'list':
                        let recognizeList = (window as any).recognizeList
                        return recognizeList();
                    case 'numlist':
                        return (window as any).recognizeNumList()
                    case 'content':
                        return (window as any).recognizeContent();
                }
            }, rule)
            console.log(results)
            return results
        } catch (e) {
            console.error(e)
            await this.browser.close()
            this.logger.log('error, close chrome')
        }
    }
    async crwalUrl(url, rules) {
        console.log('crawl url', url, rules)
        //await this.launchPage()
        try {
            //await this.page.goto(url, { waitUntil: 'networkidle0' })
            let page =  await this.poolService.pool.use(async instance=>{
                const page = await instance.newPage()
                await page.goto(url, {waitUntil: 'networkidle0', timeout: 120000 })
                return page
            })
            // DOM不能用外部函数处理
            // await this.page.exposeFunction('getPageInfo', this.getPageInfo)
            // await this.page.addScriptTag({ content: `${this.getPageInfo}`});
            let results = await page.evaluate(rules => {
                let pageInfo = {
                    name: 'root',
                    target: document,
                    innerText: ''
                }
                let errors = []
                let outputs = {}
                const applyRule = (rule, scope = { name: 'root' }) => {
                    // console.log(rule, scope)
                    let father, selector, output = {}
                    if (scope.name !== 'root') {
                        father = scope
                    } else {
                        father = pageInfo
                    }
                    if (!father) {
                        errors.push(`The scope of ${scope} is not exist`)
                        return errors;
                    }
                    let addRuleChild = (father, child) => {
                        if (!father.ruleChildren) father.ruleChildren = []
                        father.ruleChildren.push(child)
                    }

                    let parseExpressWithTarget = (target) => {
                        switch (rule.targetType) {
                            //prop
                            case 0:
                                console.log('prop', rule.target, target[rule.expression] || target.getAttribute(rule.expression))
                                addRuleChild(target, {
                                    name: rule.target,
                                    type: rule.targetType,
                                    target: target[rule.expression] || target.getAttribute(rule.expression)
                                })
                                break;
                            case 1:
                                selector = 'querySelector'
                            case 2:
                                if (!selector) {
                                    selector = 'querySelectorAll'
                                }
                                let getDom = (fatherDom, expression) => {
                                    let dom
                                    if (fatherDom && fatherDom[selector]) {
                                        dom = fatherDom[selector](expression)
                                    } else {
                                        dom = document[selector](expression)
                                    }
                                    if ((selector === 'querySelector' && dom) || (selector === 'querySelectorAll' && dom.length == 0)) {
                                        errors.push(`The target of ${rule.target} is not exist`)
                                    }
                                    if (selector === 'querySelectorAll') {
                                        dom = Array.apply(null, dom)
                                    }
                                    return dom
                                }
                                let currentTarget = {
                                    name: rule.target,
                                    type: rule.targetType,
                                    target: getDom(target, rule.expression)
                                }
                                addRuleChild(target, currentTarget)
                                if (rule.children) {
                                    rule.children.forEach(childRule => {
                                        applyRule(childRule, currentTarget)
                                    });
                                }
                                break;
                            //JS    
                            case 3:
                                let currentJSTarget = {
                                    name: rule.target,
                                    type: rule.targetType,
                                    target: eval(rule.expression)
                                }
                                addRuleChild(target, currentJSTarget)
                                if (rule.children) {
                                    rule.children.forEach(childRule => {
                                        applyRule(childRule, currentJSTarget)
                                    });
                                }
                                //pageInfo[rule.target] = eval(rule.expression)
                                break;
                        }
                    }

                    if (father.target && Array.isArray(father.target)) {
                        father.target.forEach(target => {
                            parseExpressWithTarget(target)
                        });
                    } else {
                        parseExpressWithTarget(father.target)
                    }

                }
                rules.forEach(rule => {
                    applyRule(rule)
                })
                console.log('--------------')
                var getPageInfo = (root) => {
                    let extract = (node) => {
                        let nodeData: any = {}
                        if (typeof node == "string") {
                            return node
                        } else if (node.ruleChildren) {
                            nodeData = {}
                            node.ruleChildren.forEach(child => {
                                nodeData[child.name] = extract(child)
                                //nodeData.push(extract(child))
                            })
                        } else if (typeof node.target == 'string') {
                            return node.target
                        } else if (node.target.ruleChildren) {
                            if (Array.isArray(node.target.ruleChildren)) {
                                nodeData = {}
                                node.target.ruleChildren.forEach(child => {
                                    //nodeData[node.name].push(extract(child))
                                    nodeData[child.name] = extract(child)
                                });
                            } else {
                                nodeData[node.name].push(extract(node.target.ruleChildren))
                            }
                        } else if (Array.isArray(node.target)) {
                            nodeData = []
                            node.target.forEach(item => {
                                nodeData.push(extract(item))
                            })
                        }
                        return nodeData
                    }
                    let res = extract(root)
                    // console.log(res)
                    return res
                }
                pageInfo = getPageInfo(pageInfo)
                console.log('pageInfo', pageInfo)
                return pageInfo

            }, rules)

            console.log('results', results)
            // let tags = await this.tagService.getTags(results.innerText)
            // console.log(tags)
            // let parseResults = this.getPageInfo(results)
            // console.log(parseResults)
            // await this.browser.close()
            // this.logger.log('close chrome')
            return results
        } catch (error) {
            console.error(error)
            await this.browser.close()
            this.logger.log('error, close chrome')
        } finally {
            // 最后要退出进程
            // process.exit(0)
        }

    }
    async generatePng() {
        // let file = await generateFileName(url);
        // if (file.error) {
        //     this.logger.log(file.error);
        //     return
        // }
        // this.logger.log(file.path)
        // await checkAndGenerateDir(file.path);
        // await this.page.screenshot({ path: file.png })
    }
    async generatePdf() {
        //await page.goto('data:text/html,' + html,{waitUntil:'networkidle2'})
        //   const pdf = await page.pdf({
        //       format:'A4',
        //       path:file.pdf
        //     })
        //   let pageURL=await page.evaluate((html)=>{
        //     let blob =new Blob([html], {type:'text/html,charset=UTF-8'});
        //     return URL.createObjectURL(blob);
        //   },html)
        //   this.logger.log('generate pdf...')
        // this.logger.log('generate pdf over')
    }
}
