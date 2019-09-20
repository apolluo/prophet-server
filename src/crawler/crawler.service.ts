import { Injectable, Logger } from '@nestjs/common';
import * as puppeteer from 'puppeteer'
import { generateFileName, checkAndGenerateDir } from '@/util/file'
import { CHROME_PATH } from '@/config';
import { ISource } from '@/source/interfaces/source.interface';
import { IRule } from '@/rule/interfaces/rule.interface';
import { SourceService } from '@/source/source.service';

@Injectable()
export class CrawlerService {
    private readonly logger = new Logger(CrawlerService.name)
    private browser
    private page
    constructor(private readonly sourceSevice:SourceService){
        
    }
    private async init(){
        if(this.browser&&this.page)return;
        this.browser = await puppeteer.launch({
            headless: true,
            executablePath: CHROME_PATH,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        })
        this.logger.log('打开 chrome')
        this.page = await this.browser.newPage()
    }
    async crawl(sourceIds: [String]) {
        await this.init()
        console.log('sourceIds',sourceIds)
        const crawlSources=sources=>{
            console.log(sources)
            sources.forEach((source,index)=>{
            this.crawlSource(source,index)
        })
        }
        await this.sourceSevice.findByIds(sourceIds,crawlSources)
        
        
        await this.browser.close()
        console.log(this.browser)
        this.logger.log('close chrome')
    }
    
    async crawlSource(source:ISource,index){
        let url;
        switch (source.type) {
            case 1:
                url = source.src
                break;
            case 2:
                url = source.searchApi
                break;
        }
        if (!url) return;
        this.crwalUrl(url,source.parse)
    }
    async crwalUrl(url,rule){
        await this.page.goto(url, { waitUntil: 'networkidle0' })
        let file = await generateFileName(url);
        if (file.error) {
            this.logger.log(file.error);
            return
        }
        this.logger.log(file.path)
        await checkAndGenerateDir(file.path);
        await this.page.screenshot({ path: file.png })
        console.log
        this.page.evaluate( (rule) =>{
            
            
        },rule)
        this.logger.log('generate pdf over')
    }
    async generatePdf(){
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
    }
}
