import { Injectable, Logger } from '@nestjs/common';
import * as puppeteer from 'puppeteer'
import { generateFileName, checkAndGenerateDir } from '@/util/file'
import { CHROME_PATH } from '@/config';

@Injectable()
export class CrawlerService {
    private readonly logger = new Logger(CrawlerService.name)
    async crawlUrl(url) {
        if (!url) return;
        const pathToExtension = CHROME_PATH;
        const browser = await puppeteer.launch({
            headless: true,
            executablePath: pathToExtension,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        })
        this.logger.log('打开 chrome')
        const page = await browser.newPage()
        //   let pageURL=await page.evaluate((html)=>{
        //     let blob =new Blob([html], {type:'text/html,charset=UTF-8'});
        //     return URL.createObjectURL(blob);
        //   },html)
        //   this.logger.log('generate pdf...')
        await page.goto(url, { waitUntil: 'networkidle0' })
        let file = await generateFileName(url);
        if (file.error) {
            this.logger.log(file.error);
            return
        }
        this.logger.log(file.path)
        await checkAndGenerateDir(file.path);
        await page.screenshot({ path: file.png })
        //await page.goto('data:text/html,' + html,{waitUntil:'networkidle2'})
        //   const pdf = await page.pdf({
        //       format:'A4',
        //       path:file.pdf
        //     })
        this.logger.log('generate pdf over')
        await browser.close()
        this.logger.log('close chrome')
    }
}
