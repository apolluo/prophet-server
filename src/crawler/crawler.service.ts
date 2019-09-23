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
    async crawl(taskDto: CreateTaskDto) {
        //await this.init()
        let sourceIds = taskDto.source
        console.log('sourceIds', sourceIds)
        const crawlSources = async sources => {
            console.log(sources)
            await sources.forEach(
                async (source, index) => {
                    await this.crawlSource(source, taskDto, index)
                })
            // await this.browser.close()
            // //console.log(this.browser)
            // this.logger.log('close chrome')
        }
        let sources= await this.sourceSevice.findByIds(sourceIds)
        crawlSources(sources)
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
        this.crwalUrl(url, source.parse)
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
        // let file = await generateFileName(url);
        // if (file.error) {
        //     this.logger.log(file.error);
        //     return
        // }
        // this.logger.log(file.path)
        // await checkAndGenerateDir(file.path);
        // await this.page.screenshot({ path: file.png })

        let results = await this.page.evaluate((rules) => {
            let pageInfo = {}
            let errors = []
            const applyRule = (rule) => {
                switch (rule.targetType) {
                    case 0:

                        break;
                    case 1:
                        let ruleParse = rule.expression.match(/All\((.+)\)/)
                        let expression, isAll, selector
                        if (ruleParse) {
                            isAll = true
                            expression = ruleParse[1]
                            selector = 'querySelectorAll'
                        } else {
                            expression = rule.expression
                            selector = 'querySelector'
                        }

                        if (rule.scope) {
                            if (pageInfo[rule.scope]) {
                                if (pageInfo[rule.scope].length) {
                                    pageInfo[rule.scope].forEach(item => {
                                        item[rule.target] = item[selector](rule.expression)
                                    });
                                } else {
                                    pageInfo[rule.scope][rule.target] = pageInfo[rule.scope][selector](rule.expression)
                                }
                            } else {
                                errors.push(`The scope of ${rule.scope} is not exist`)
                            }
                        } else {
                            pageInfo[rule.target] = document[selector](rule.expression)
                        }
                        if (!pageInfo[rule.target].length) {
                            errors.push(`The target of ${rule.target} is not exist`)
                        }

                        break;
                    case 2:
                        break;
                    case 3:
                        pageInfo[rule.target] = eval(rule.expression)
                        break;
                }
            }
            rules.forEach(rule => {
                applyRule(rule)
            })
            return pageInfo

        }, rules)
        console.log(results)
        //await this.browser.close()
        //console.log(this.browser)
        this.logger.log('close chrome')

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
