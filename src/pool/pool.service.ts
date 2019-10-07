/// <refrence path="@/util/puppeteer-pool.d.ts" />;
import { Injectable } from '@nestjs/common';

// import * as initPuppeteerPool from "@/util/puppeteer-pool";
import { CHROME_PATH } from '@/config';
const initPuppeteerPool = require('../util/puppeteer-pool')
@Injectable()
export class PoolService {
    pool: object
    constructor() {
        console.log('initPuppeteerPool', initPuppeteerPool)
        // this.pool = initPuppeteerPool({ // 全局只应该被初始化一次
        //     puppeteerArgs: {
        //         ignoreHTTPSErrors: true,
        //         headless: false, // 是否启用无头模式页面
        //         timeout: 0,
        //         pipe: true, // 不使用 websocket 
        //         ignoreDefaultArgs: ["--enable-automation"],
        //         executablePath: CHROME_PATH,
        //         args: ['--no-sandbox', '--disable-setuid-sandbox']
        //     }
        // })
    }
    getPool() {
        return this.pool
    }
}
