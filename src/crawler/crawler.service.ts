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

@Injectable()
export class CrawlerService {
    private readonly logger = new Logger(CrawlerService.name)
    private browser
    private page
    constructor(private readonly sourceSevice: SourceService) {

    }
    private async init() {
        //if (this.browser && this.page) return;
        this.browser = await puppeteer.launch({
            headless: true,
            executablePath: CHROME_PATH,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        })
        this.logger.log('打开 chrome')
        this.page = await this.browser.newPage()
    }
    private getPageInfo(root) {
        let extract = (node) => {
            let nodeData:any={}
            if(typeof node=="string"){
                return node
            }else if(node.ruleChildren){
                nodeData=[]
                node.ruleChildren.forEach(child=>{
                    nodeData.push(extract(child))
                })
            }else if(typeof node.target=='string'){
                return  node.target
            }else if (node.target.ruleChildren) {
                if(Array.isArray(node.target.ruleChildren)){
                    nodeData[node.name]= {}
                    node.target.ruleChildren.forEach(child => {
                        //nodeData[node.name].push(extract(child))
                        nodeData[node.name][child.name]=extract(child)
                    });
                }else{
                    //nodeData[node.name].push(extract(node.target.ruleChildren ))
                }
            }else if(Array.isArray(node.target)){
                nodeData=[]
                node.target.forEach(item=>{
                    nodeData.push(extract(item))
                })
            }
            return nodeData
        }
        let res = extract(root)
        console.log(res)
        return res
    }
    async crawl(taskDto) {
        //await this.init()
        let sourceIds = taskDto.source
        console.log('sourceIds', sourceIds)
        console.log(taskDto)
        const crawlSources = async sources => {
            console.log('sources', sources)
            let crawPromises=[],that=this
            for(var i=0;i<sources.length;i++){
                crawPromises.push(that.crawlSource(sources[i], taskDto, i)) 
            }
            return Promise.all(crawPromises)
            // return await sources.forEach(
            //     async (source, index) => {
            //         await this.crawlSource(source, taskDto, index)
            //     })
            // await this.browser.close()
            // //console.log(this.browser)
            // this.logger.log('close chrome')
        }
        return await this.sourceSevice.findByIds(sourceIds)
        .then(crawlSources)
        .then((res)=>{
            console.log('crawlSources then',res)
            return res
        })
    }

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
        return this.crwalUrl(url, source.parse)
    }
    async crwalUrl(url, rules) {
        console.log('crawl url', url, rules)
        this.browser = await puppeteer.launch({
            //headless: false,
            executablePath: CHROME_PATH,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        })
        this.logger.log('打开 chrome')
        this.page = await this.browser.newPage()
        await this.page.goto(url, { waitUntil: 'networkidle0' })

        let results = await this.page.evaluate((rules) => {
            let pageInfo = {
                name: 'root',
                target: document
            }
            let errors = []
            let outputs = {}
            const applyRule = (rule, scope = { name: 'root' }) => {
                console.log(rule, scope)
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
                            // father.ruleChild={
                            //     name:rule.target,
                            //     type:rule.targetType,
                            //     target:father.target[rule.expression] || father.target.getAttribute(rule.expression)
                            // }
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
            return pageInfo

        }, rules)
        console.log(results)
        let parseResults=this.getPageInfo(results)
        console.log(parseResults)
        await this.browser.close()
        this.logger.log('close chrome')
        return parseResults
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
