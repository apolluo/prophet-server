/// <refrence path="@/util/puppeteer-pool.d.ts" />;
import { Injectable, OnApplicationShutdown, OnModuleDestroy, OnModuleInit } from '@nestjs/common';

// import * as initPuppeteerPool from "@/util/puppeteer-pool";
import { CHROME_PATH } from '@/config';
const initPuppeteerPool = require('../util/puppeteer-pool')
@Injectable()
export class PoolService implements OnApplicationShutdown,OnModuleDestroy,OnModuleInit {
    pool: any
    constructor() {
        this.pool = initPuppeteerPool({ // 全局只应该被初始化一次
            puppeteerArgs: {
                ignoreHTTPSErrors: true,
                headless: false, // 是否启用无头模式页面
                timeout: 0,
                pipe: true, // 不使用 websocket 
                ignoreDefaultArgs: ["--enable-automation"],
                executablePath: CHROME_PATH,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            }
        })
        console.log('initPuppeteerPool', this.pool)
    }
    async onModuleInit(){
        this.pool.start()
        console.log('OnModuleInit')
    }
    async onModuleDestroy(){
        await this.pool.drain().then(() => this.pool.clear())
        console.log('OnModuleDestroy')
    }
    async onApplicationShutdown(signal:string){
        console.log(signal)
        await this.pool.drain().then(() => this.pool.clear())
        console.log('clear',this.pool)
    }
}
